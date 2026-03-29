const {createJobEvent, findJobEventByJobId} = require('../repositories/jobEvent.repository');
const {findJobById} = require('../repositories/job.repository');

const { v4: uuidv4 } = require('uuid')
const AppError = require('../utils/appError.util');

const handleCreateJobEvent = async (jobId, eventType) => {
    const newEvent = {
        id: uuidv4(),
        jobId: jobId,
        type: eventType,
        createdAt: new Date()
    }

    const event = await createJobEvent(newEvent);
    if(!event){
        console.log('failed to log event');
    }

}

const handleGetAllJobEvents = async (userId, jobId) => {
    const job = await findJobById(jobId);
    if(!job){
        throw new AppError("job not found", StatusCodes.NOT_FOUND);
    }
    if(job.ownerId !== userId){
        throw new AppError("access denied", StatusCodes.FORBIDDEN);
    }

    const jobEvents = await findJobEventByJobId(jobId);
    
    return {
        data: jobEvents
    }

}

module.exports = {
    handleCreateJobEvent,
    handleGetAllJobEvents
}