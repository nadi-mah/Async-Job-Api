const jobs = [];

const createJob = (newJob) => {
    jobs.push(newJob);
    return true;
}

const findJobById = (jobId) => {
    return jobs.find(job => job.id === jobId);
}
const findAllJobsByUserId = (userId) => {
    return jobs.filter(job => job.ownerId === userId);
}
const findPendingAndEligibleJobs = () => {
    return jobs.filter(job => 
        job.status === 'pending' && 
        job.nextRunAt <= new Date()  && 
        job.attempts < job.maxAttempts);
}
const updateJob = (jobId, field, newValue) => {
    const index = jobs.findIndex(job => job.id === jobId);
    if(index === -1){
        return null;
    } 
    jobs[index] = {
        ...jobs[index],
        [field]: newValue,
        updatedAt: new Date()
    };

}

module.exports = {
    createJob,
    findJobById,
    findAllJobsByUserId,
    findPendingAndEligibleJobs,
    updateJob
}