const {getJobStatsByUserId} = require('../repositories/dashboard.repository');


const handleGetDashboard = async(userId) => {

    const result = await getJobStatsByUserId(userId);


    const totalJobs = result.total_jobs;
    const doneJobs = result.done;

    const successRate =
    totalJobs === 0
        ? '0%'
        : `${Math.round((doneJobs / totalJobs) * 100)}%`;

        return {
        data: {
            totalJobs: result.total_jobs,
            pending: result.pending,
            processing: result.processing,
            done: result.done,
            failed: result.failed,
            retryingJobs: result.retrying_jobs,
            successRate
        }
        };

    }

module.exports = {
    handleGetDashboard
}