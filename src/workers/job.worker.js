const {findPendingAndEligibleJobs, updateJob} = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('../services/jobEvent.service');

const {withTransaction} = require('../utils/transaction.util');
const store = require('../utils/inMemoryStore');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');

const {jobCacheKey, allJobsCacheKey} = require('../helper/jobCacheKey.helper');

const processJobs = async() => {

    while (true){
        const jobs = await findPendingAndEligibleJobs();
        if(jobs.length === 0){
            await sleep(5000);
            continue;
        }else{
            const firstJob = jobs[0]; //first in the queue

            const newAttempts = firstJob.attempts + 1;
            await withTransaction(async (client) => {
                await updateJob(client, firstJob.id, 'status', JOB_STATUS.PROCESSING);
                await updateJob(client, firstJob.id, 'attempts', newAttempts);
                await handleCreateJobEvent(firstJob.id, JOB_EVENTS.PROCESSING_STARTED, client);
            })

            // const key = `user:${firstJob.owner_id}:job:${firstJob.id}`;
            const key = jobCacheKey(firstJob.owner_id, firstJob.id);
            const allJobsKey = allJobsCacheKey(firstJob.owner_id);
            store.del(key);
            store.del(allJobsKey);
        
            await sleep(7000);

            const randomNumber = Math.floor(Math.random()*10);

            // Job Success
            if(randomNumber % 2 === 0){
                await withTransaction(async(client) => {
                    await updateJob(client, firstJob.id, 'status', JOB_STATUS.DONE);
                    await handleCreateJobEvent(firstJob.id, JOB_EVENTS.COMPLETED, client);
                })
                store.del(key);
                store.del(allJobsKey);
            }else{
                // Job Retry
                if(newAttempts < firstJob.max_attempts){
                    await withTransaction(async(client) => {
                        await updateJob(client, firstJob.id, 'nextRunAt', new Date(Date.now() + 5000));
                        await updateJob(client, firstJob.id, 'status', JOB_STATUS.PENDING);
                        await handleCreateJobEvent(firstJob.id, JOB_EVENTS.RETRY, client);
                    })
                    store.del(key);
                    store.del(allJobsKey);
                    
                // Job Failure    
                }else{
                    await withTransaction(async(client) => {
                        await updateJob(client, firstJob.id, 'status', JOB_STATUS.FAILED);
                        await handleCreateJobEvent(firstJob.id, JOB_EVENTS.FAILED, client);
                    })
                    store.del(key);
                    store.del(allJobsKey);
                }

            }
        }

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobs
}