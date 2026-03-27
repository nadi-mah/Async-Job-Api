const {createJobEvent, findJobEventByJobId} = require('../repositories/jobEvent.repository');
const {findJobById} = require('../repositories/job.repository');

const { v4: uuidv4 } = require('uuid')

const handleCreateJobEvent = async (jobId, eventType) => {
    const newEvent = {
        id: uuidv4(),
        jobId: jobId,
        type: eventType,
        createdAt: new Date()
    }

    const event = createJobEvent(newEvent);
    if(!event){
        console.log('failed to log event');
    }

}

const handleGetAllJobEvents = async (userId, jobId) => {
    const job = findJobById(jobId);
    if(!job){
        throw new AppError("job not found", StatusCodes.NOT_FOUND);
    }
    if(job.ownerId !== userId){
        throw new AppError("access denied", StatusCodes.FORBIDDEN);
    }

    const jobEvents = findJobEventByJobId(jobId);
    
    return {
        data: jobEvents
    }

}

module.exports = {
    handleCreateJobEvent,
    handleGetAllJobEvents
}