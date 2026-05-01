const {findPendingAndEligibleJobs, updateJob, claimEligibleJobs} = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('../services/jobEvent.service');

const {withTransaction} = require('../utils/transaction.util');
const store = require('../utils/inMemoryStore');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');

const {jobCacheKey, allJobsCacheKey} = require('../helper/jobCacheKey.helper');

const CONCURRENCY_LIMIT = 3;
const POLL_INTERVAL_MS = 5000;
const PROCESSING_TIME_MS = 7000;
const RETRY_DELAY_MS = 5000;

const processSingleJob = async(job) => {
    // const key = `user:${firstJob.owner_id}:job:${firstJob.id}`;
    const key = jobCacheKey(job.owner_id, job.id);
    const allJobsKey = allJobsCacheKey(job.owner_id);
    store.del(key);
    store.del(allJobsKey);

    await sleep(PROCESSING_TIME_MS);

    const randomNumber = Math.floor(Math.random()*10);

    // Job Success
    if(randomNumber % 2 === 0){
        await withTransaction(async(client) => {
            await updateJob(client, job.id, 'status', JOB_STATUS.DONE);
            await handleCreateJobEvent(job.id, JOB_EVENTS.COMPLETED, client);
        })
        store.del(key);
        store.del(allJobsKey);
    }else{
        // Job Retry
        if(job.attempts < job.max_attempts){
            await withTransaction(async(client) => {
                await updateJob(client, job.id, 'nextRunAt', new Date(Date.now() + 5000));
                await updateJob(client, job.id, 'status', JOB_STATUS.PENDING);
                await handleCreateJobEvent(job.id, JOB_EVENTS.RETRY, client);
            })
            store.del(key);
            store.del(allJobsKey);
            
        // Job Failure    
        }else{
            await withTransaction(async(client) => {
                await updateJob(client, job.id, 'status', JOB_STATUS.FAILED);
                await handleCreateJobEvent(job.id, JOB_EVENTS.FAILED, client);
            })
            store.del(key);
            store.del(allJobsKey);
        }

    }
}

const processJobsConcurrent = async() => {

    while (true){

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

        await Promise.all(
            claimedJobs.map((job) => processSingleJob(job))
          );

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobsConcurrent
}