const {createJobEvent, findJobEventByJobId} = require('../repositories/jobEvent.repository');
const {findJobById} = require('../repositories/job.repository');

const { v4: uuidv4 } = require('uuid')
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError.util');

const pool = require('../config/db');

const handleCreateJobEvent = async (jobId, eventType, db = pool) => {
    const newEvent = {
        id: uuidv4(),
        jobId: jobId,
        type: eventType,
        createdAt: new Date()
    }

    const event = await createJobEvent(db, newEvent);
    if(!event){
        console.log('failed to log event');
    }

}

const handleGetAllJobEvents = async (userId, jobId) => {
    console.log(userId)
    const job = await findJobById(jobId);
    console.log(job)
    if(!job){
        throw new AppError("job not found", StatusCodes.NOT_FOUND);
    }
    if(job.owner_id !== userId){
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