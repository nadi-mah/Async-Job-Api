const jobs = [];

const createJob = (newJob) => {
    jobs.push(newJob);
    console.log(newJob)
    return true;
}

const findJobById = (jobId) => {
    return jobs.find(job => job.id === jobId);
}
const findAllJobsByUserId = (userId) => {
    return jobs.filter(job => job.ownerId === userId);
}

module.exports = {
    createJob,
    findJobById,
    findAllJobsByUserId
}