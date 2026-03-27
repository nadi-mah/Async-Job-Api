const {findPendingJobs, updateJobStatus} = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('../services/jobEvent.service');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');
const processJobs = async() => {

    while (true){
        const jobs = findPendingJobs();
        if(jobs.length === 0){
            await sleep(5000);
            continue;
        }else{
            const firstJobId = jobs[0].id; //first in the queue
            updateJobStatus(firstJobId, JOB_STATUS.PROCESSING);
            handleCreateJobEvent(firstJobId, JOB_EVENTS.PROCESSING_STARTED);
        
            await sleep(7000);
            const randomNumber = Math.floor(Math.random()*10);
            if(randomNumber % 2 === 0){
                updateJobStatus(firstJobId, JOB_STATUS.DONE);
                handleCreateJobEvent(firstJobId, JOB_EVENTS.COMPLETED);
            }else{
                updateJobStatus(firstJobId, JOB_STATUS.FAILED);
                handleCreateJobEvent(firstJobId, JOB_EVENTS.FAILED);
            }
        }

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobs
}