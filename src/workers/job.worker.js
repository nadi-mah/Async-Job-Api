const {findPendingJobs, updateJobStatus} = require('../repositories/job.repository');

const processJobs = async() => {

    while (true){
        const jobs = findPendingJobs();
        if(jobs.length === 0){
            await sleep(5000);
            continue;
        }else{
            const firstJobId = jobs[0].id; //first in the queue
            updateJobStatus(firstJobId, 'processing');
        
            await sleep(7000);
            const randomNumber = Math.floor(Math.random()*10);
            if(randomNumber % 2 === 0){
                updateJobStatus(firstJobId, 'done');
            }else{
                updateJobStatus(firstJobId, 'failed');
            }
        }

    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    processJobs
}