const {findPendingAndEligibleJobs, updateJob} = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('../services/jobEvent.service');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');
const processJobs = async() => {

    while (true){
        const jobs = await findPendingAndEligibleJobs();
        if(jobs.length === 0){
            await sleep(5000);
            continue;
        }else{
            const firstJob = jobs[0]; //first in the queue

            await updateJob(firstJob.id, 'status', JOB_STATUS.PROCESSING);
            const newAttempts = firstJob.attempts + 1;
            await updateJob(firstJob.id, 'attempts', newAttempts);
            await handleCreateJobEvent(firstJob.id, JOB_EVENTS.PROCESSING_STARTED);
        
            await sleep(7000);

            const randomNumber = Math.floor(Math.random()*10);
            // Job Success
            if(randomNumber % 2 === 0){
                await updateJob(firstJob.id, 'status', JOB_STATUS.DONE);
                await handleCreateJobEvent(firstJob.id, JOB_EVENTS.COMPLETED);
            }else{
                // Job Retry
                if(newAttempts < firstJob.max_attempts){
                    await updateJob(firstJob.id, 'status', JOB_STATUS.PENDING);
                    await updateJob(firstJob.id, 'nextRunAt', new Date(Date.now() + 5000));
                    await handleCreateJobEvent(firstJob.id, JOB_EVENTS.RETRY);
                    
                // Job Failure    
                }else{
                    await updateJob(firstJob.id, 'status', JOB_STATUS.FAILED);
                    await handleCreateJobEvent(firstJob.id, JOB_EVENTS.FAILED);
                }

            }
        }

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobs
}