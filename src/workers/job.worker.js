const {findPendingAndEligibleJobs, updateJob} = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('../services/jobEvent.service');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');
const processJobs = async() => {

    while (true){
        const jobs = findPendingAndEligibleJobs();
        if(jobs.length === 0){
            await sleep(5000);
            continue;
        }else{
            const firstJob = jobs[0]; //first in the queue

            updateJob(firstJob.id, 'status', JOB_STATUS.PROCESSING);
            const newAttempts = firstJob.attempts + 1;
            updateJob(firstJob.id, 'attempts', newAttempts);
            handleCreateJobEvent(firstJob.id, JOB_EVENTS.PROCESSING_STARTED);
        
            await sleep(7000);

            const randomNumber = Math.floor(Math.random()*10);
            // Job Success
            if(randomNumber % 2 === 0){
                updateJob(firstJob.id, 'status', JOB_STATUS.DONE);
                handleCreateJobEvent(firstJob.id, JOB_EVENTS.COMPLETED);
            }else{
                // Job Retry
                if(newAttempts < firstJob.maxAttempts){
                    updateJob(firstJob.id, 'status', JOB_STATUS.PENDING);
                    updateJob(firstJob.id, 'nextRunAt', new Date(Date.now() + 5000));
                    handleCreateJobEvent(firstJob.id, JOB_EVENTS.RETRY);
                    
                // Job Failure    
                }else{
                    updateJob(firstJob.id, 'status', JOB_STATUS.FAILED);
                    handleCreateJobEvent(firstJob.id, JOB_EVENTS.FAILED);
                }

            }
        }

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobs
}