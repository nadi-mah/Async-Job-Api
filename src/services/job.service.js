const { StatusCodes } = require('http-status-codes');
const { createJob, findJobById, findAllJobsByUserId, findAllJobsByUserIdPagination } = require('../repositories/job.repository');
const {handleCreateJobEvent} = require('./jobEvent.service');

const {JOB_STATUS, JOB_EVENTS} = require('../constants/job.constant');
const AppError = require('../utils/appError.util');

const { v4: uuidv4 } = require('uuid')

const { withTransaction } = require('../utils/transaction.util');



const handleCreateJob = async(userId) => {

    const result = await withTransaction(async (client) => {
        const newJob = {
            id: uuidv4(),
            ownerId: userId,
            status: JOB_STATUS.PENDING,
            attempts: 0,
            maxAttempts: 3,
            nextRunAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    
        const result = await createJob(client, newJob);
        // throw new Error('TEST_TRANSACTION_ROLLBACK');
        await handleCreateJobEvent(newJob.id, JOB_EVENTS.CREATED, client);
        
        return result;
    })

    if(!result){
        throw new AppError("Failed to create the job", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return {
        message: "job created successfully",
        data: {
            id: result.id, 
            createdTime: result.createdAt
        }
    };

}
const handleGetJob = async(userId, jobId) => {
    const job = await findJobById(jobId);

    if(!job){
        throw new AppError("job not found", StatusCodes.NOT_FOUND);
    }
    if(job.owner_id !== userId){
        throw new AppError("access denied", StatusCodes.FORBIDDEN);
    }

    return {
        data: job
    }
}

const handleGetAllJobs = async(userId, limit, offset) => {
    // const jobs = await findAllJobsByUserId(userId);
    const jobs = await findAllJobsByUserIdPagination(userId, limit, offset);
    
    if(jobs.length === 0){
        throw new AppError("no job found", StatusCodes.NOT_FOUND);
    }
    return {
        data: jobs
    }
}

const handleCreateBulkJobs = async(userId, count) => {
    if(!count || count <= 0){
        throw new AppError("count must be greater than 0", StatusCodes.BAD_REQUEST);
    }
    if(count > 50){
        throw new AppError("count cannot be more than 50", StatusCodes.BAD_REQUEST);
    }
    const jobs = [];

    for (let i = 0; i < count; i++){
        const newJob = {
            id: uuidv4(),
            ownerId: userId,
            status: JOB_STATUS.PENDING,
            attempts: 0,
            maxAttempts: 3,
            nextRunAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await withTransaction(async(client) => {

            const result = await createJob(client, newJob);
            await handleCreateJobEvent(newJob.id, JOB_EVENTS.CREATED, client);

            return result;

        })

        if(!result){
            throw new AppError(`Failed to create the jobs in step ${i}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        jobs.push(result);
    }
    return {
        message: `${jobs.length} jobs created successfully`,
        data: jobs
    }
}


module.exports = {
    handleCreateJob,
    handleGetJob,
    handleGetAllJobs,
    handleCreateBulkJobs
}