const { StatusCodes } = require('http-status-codes');
const { createJob, findJobById, findAllJobsByUserId } = require('../repositories/job.repository');

const AppError = require('../utils/appError.util');

const { v4: uuidv4 } = require('uuid')


const handleCreateJob = async(userId) => {
    const newJob = {
        id: uuidv4(),
        ownerId: userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const result = createJob(newJob);
    if(!result){
        throw new AppError("Failed to create the job", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return {
        message: "job created successfully",
        data: {
            id: newJob.id, 
            createdTime: newJob.createdAt
        }
    };

}
const handleGetJob = async(userId, jobId) => {
    const job = findJobById(jobId);
    if(!job){
        throw new AppError("job not found", StatusCodes.NOT_FOUND);
    }
    if(job.ownerId !== userId){
        throw new AppError("access denied", StatusCodes.FORBIDDEN);
    }
    return {
        data: job
    }
}

const handleGetAllJobs = async(userId) => {
    const jobs = findAllJobsByUserId(userId);
    if(jobs.length === 0){
        throw new AppError("no job found", StatusCodes.NOT_FOUND);
    }
    return {
        data: jobs
    }
}


module.exports = {
    handleCreateJob,
    handleGetJob,
    handleGetAllJobs
}