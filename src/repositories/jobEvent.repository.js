const jobEvents = [];

const findJobEventByJobId = (jobId) => {
    return jobEvents.filter(jobEvent => jobEvent.jobId === jobId);
}

const createJobEvent = (newEvent) => {
    jobEvents.push(newEvent);
    return newEvent;

}

module.exports = {
    findJobEventByJobId,
    createJobEvent
}