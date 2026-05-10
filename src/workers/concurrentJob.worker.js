const { 
    updateJob, 
    claimEligibleJobs, 
} = require('../repositories/job.repository');

const {handleCreateJobEvent} = require('../services/jobEvent.service');
const {handleCreateDeadJob} = require('../services/deadLetter.service');
const { processJobByType } = require('../services/jobProcessor.service');

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
    try {
        console.log(`${workerId} started job ${job.id}`);

        const key = jobCacheKey(job.owner_id, job.id);
        const prefix = `user:${job.owner_id}:allJobs`
        store.del(key);
        store.delByPrefix(prefix);

        await sleep(PROCESSING_TIME_MS);

        let jobResult;
        let failureReason = null;

        try {
            jobResult = await processJobByType(job);
        } catch (error) {
            failureReason = error.message;
        }

        if(failureReason){
            // Job Retry
            if(job.attempts < job.max_attempts){
                await withTransaction(async(client) => {
                    await updateJob(client, job.id, 'nextRunAt', new Date(Date.now() + RETRY_DELAY_MS));
                    await updateJob(client, job.id, 'status', JOB_STATUS.PENDING);
                    await handleCreateJobEvent(job.id, JOB_EVENTS.RETRY, client);
                })
                store.del(key);
                store.delByPrefix(prefix);
                
            // Job Failure    
            }else{
                await withTransaction(async(client) => {
                    await updateJob(client, job.id, 'status', JOB_STATUS.FAILED);
                    await handleCreateJobEvent(job.id, JOB_EVENTS.FAILED, client);
                    await handleCreateDeadJob(job.id, job.owner_id, job.attempts, failureReason, client);
                    
                })
                store.del(key);
                store.delByPrefix(prefix);
            }
        }else{
            // Job Success
            await withTransaction(async(client) => {
                await updateJob(client, job.id, 'status', JOB_STATUS.DONE);
                await updateJob(client, job.id, 'result', jobResult);
                await handleCreateJobEvent(job.id, JOB_EVENTS.COMPLETED, client);
            })
            store.del(key);
            store.delByPrefix(prefix);
        }
        console.log(`${workerId} completed/failed/retried job ${job.id}`);
    } catch (error) {
        console.error(`${workerId} unexpected error on job ${job.id}:`, error.message);    
    }
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