const dotenv = require('dotenv');
dotenv.config();

const { processJobs } = require('./workers/job.worker');
const {processJobsConcurrent, stopWorker} = require('./workers/concurrentJob.worker');

const workerId = process.env.WORKER_ID || 'worker-1';

console.log(`${workerId} is starting...`);

processJobsConcurrent(workerId).catch((error) => {
    console.error(`${workerId} crashed:`, error);
    process.exit(1);
  });
  
process.on('SIGINT', () => {
    console.log(`${workerId} received SIGINT`);
    stopWorker();
});

process.on('SIGTERM', () => {
    console.log(`${workerId} received SIGTERM`);
    stopWorker();
});