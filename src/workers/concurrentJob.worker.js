const { 
    updateJob, 
    claimEligibleJobs, 
} = require('../repositories/job.repository');

const {handleCreateJobEvent} = require('../services/jobEvent.service');
const {handleCreateDeadJob} = require('../services/deadLetter.service');

const {withTransaction} = require('../utils/transaction.util');
const store = require('../utils/inMemoryStore');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');

const {jobCacheKey} = require('../helper/jobCacheKey.helper');


const CONCURRENCY_LIMIT = 3;
const POLL_INTERVAL_MS = 5000;
const PROCESSING_TIME_MS = 7000;
const RETRY_DELAY_MS = 5000;

let isShuttingDown = false;

const stopWorker = () => {
    isShuttingDown = true;
}

const processSingleJob = async(job, workerId) => {
    // const key = `user:${firstJob.owner_id}:job:${firstJob.id}`;

    console.log(`${workerId} started job ${job.id}`);

    const key = jobCacheKey(job.owner_id, job.id);
    // const allJobsKey = allJobsCacheKey(job.owner_id);
    const prefix = `user:${job.owner_id}:allJobs`
    store.del(key);
    // store.del(allJobsKey);
    store.delByPrefix(prefix);

    await sleep(PROCESSING_TIME_MS);

    const randomNumber = Math.floor(Math.random()*10);

    // Job Success
    if(randomNumber % 2 === 0){
        await withTransaction(async(client) => {
            await updateJob(client, job.id, 'status', JOB_STATUS.DONE);
            await handleCreateJobEvent(job.id, JOB_EVENTS.COMPLETED, client);
        })
        store.del(key);
        // store.del(allJobsKey);
        store.delByPrefix(prefix);
    }else{
        // Job Retry
        if(job.attempts < job.max_attempts){
            await withTransaction(async(client) => {
                await updateJob(client, job.id, 'nextRunAt', new Date(Date.now() + 5000));
                await updateJob(client, job.id, 'status', JOB_STATUS.PENDING);
                await handleCreateJobEvent(job.id, JOB_EVENTS.RETRY, client);
            })
            store.del(key);
            // store.del(allJobsKey);
            store.delByPrefix(prefix);
            
        // Job Failure    
        }else{
            await withTransaction(async(client) => {
                await updateJob(client, job.id, 'status', JOB_STATUS.FAILED);
                await handleCreateJobEvent(job.id, JOB_EVENTS.FAILED, client);
                await handleCreateDeadJob(job.id, job.owner_id, job.attempts, client);
                
            })
            store.del(key);
            // store.del(allJobsKey);
            store.delByPrefix(prefix);
        }

    }
    console.log(`${workerId} completed/failed/retried job ${job.id}`);
}

const processJobsConcurrent = async(workerId) => {

    while (!isShuttingDown){

        console.log(`${workerId} is checking jobs...`);

        const claimedJobs = await withTransaction(async(client) => {
            const jobs = await claimEligibleJobs(client, CONCURRENCY_LIMIT);

            for (const job of jobs){
                await handleCreateJobEvent(job.id, JOB_EVENTS.PROCESSING_STARTED, client);
            }

            return jobs;

        })
        if(claimedJobs.length === 0){
            await sleep(POLL_INTERVAL_MS);
            continue;
        }

        console.log(`${workerId} claimed ${claimedJobs.length} job(s)`);

        await Promise.all(
            claimedJobs.map((job) => processSingleJob(job, workerId))
          );

    }
    console.log(`${workerId} stopped gracefully`);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobsConcurrent,
    stopWorker
}