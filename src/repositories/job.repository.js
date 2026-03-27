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
const findPendingJobs = () => {
    return jobs.filter(job => job.status === 'pending');
}
const updateJobStatus = (jobId, newStatus) => {
    const index = jobs.findIndex(job => job.id === jobId);
    if(index === -1){
        return null;
    } 
    jobs[index] = {
        ...jobs[index],
        status: newStatus,
        updatedAt: new Date()
    };

}

module.exports = {
    createJob,
    findJobById,
    findAllJobsByUserId,
    findPendingJobs,
    updateJobStatus
}