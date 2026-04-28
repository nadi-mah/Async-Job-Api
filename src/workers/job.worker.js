const {findPendingAndEligibleJobs, updateJob} = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('../services/jobEvent.service');

const {withTransaction} = require('../utils/transaction.util');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');
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
        
            await sleep(7000);

            const randomNumber = Math.floor(Math.random()*10);

            // Job Success
            if(randomNumber % 2 === 0){
                await withTransaction(async(client) => {
                    await updateJob(client, firstJob.id, 'status', JOB_STATUS.DONE);
                    await handleCreateJobEvent(firstJob.id, JOB_EVENTS.COMPLETED, client);
                })
            }else{
                // Job Retry
                if(newAttempts < firstJob.max_attempts){
                    await withTransaction(async(client) => {
                        await updateJob(client, firstJob.id, 'nextRunAt', new Date(Date.now() + 5000));
                        await updateJob(client, firstJob.id, 'status', JOB_STATUS.PENDING);
                        await handleCreateJobEvent(firstJob.id, JOB_EVENTS.RETRY, client);
                    })
                    
                // Job Failure    
                }else{
                    await withTransaction(async(client) => {
                        await updateJob(client, firstJob.id, 'status', JOB_STATUS.FAILED);
                        await handleCreateJobEvent(firstJob.id, JOB_EVENTS.FAILED, client);
                    })
                }

            }
        }

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobs
}