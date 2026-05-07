const { v4: uuidv4 } = require('uuid')
const { StatusCodes } = require('http-status-codes');

const {
    createDeadLetterJob, 
    findAllDeadJobsByUserId, 
    findDeadJobById, 
    deleteDeadJob
} = require('../repositories/deadLetter.repository');

const {updateJob} = require('../repositories/job.repository');

const { handleCreateJobEvent } = require('./jobEvent.service');

const { withTransaction } = require('../utils/transaction.util');
const AppError = require('../utils/appError.util');

const store = require('../utils/inMemoryStore');

const { JOB_STATUS, JOB_EVENTS, DEAD_JOB_STATUS } = require('../constants/job.constant');

const { allDeadJobsCacheKey, deadJobCacheKey } = require('../helper/deadJobsCacheKey.helper');
const { jobCacheKey } = require('../helper/jobCacheKey.helper');

const handleCreateDeadJob = async (jobId, ownerId, attempts, db) => {
    const newDeadJob = {
        id: uuidv4(),
        jobId,
        ownerId,
        reason: 'nothing',
        status: 'active',
        attempts,
        failedAt: new Date()
    }
    const result = await createDeadLetterJob(db, newDeadJob);
    if(!result){
        console.log('failed to create dead job');
    }
}

const handleGetAllDeadJobs = async(userId) => {
    const result = await findAllDeadJobsByUserId(userId);

    return {
        deadJobs: result
    }
}

const handleGetDeadJob = async(userId, deadJobId) => {
    const deadJob = await findDeadJobById(deadJobId);

    if(!deadJob){
        throw new AppError("dead letter job not found", StatusCodes.NOT_FOUND);
    }
    if(deadJob.owner_id !== userId){
        throw new AppError("access denied", StatusCodes.FORBIDDEN);
    }
    return {
        data: deadJob
    }
}

const handleReplayDeadJob = async(userId, deadJobId, newMaxAttempts) => {

    // possible race condition!!!!!
    const deadJob = await findDeadJobById(deadJobId);

    if(!deadJob){
        throw new AppError("dead letter job not found", StatusCodes.NOT_FOUND);
    }

    if(deadJob.owner_id !== userId){
        throw new AppError("access denied", StatusCodes.FORBIDDEN);
    }

    const result = await withTransaction(async(client) => {
        await updateJob(client, deadJob.job_id, 'status', JOB_STATUS.PENDING);
        await updateJob(client, deadJob.job_id, 'attempts', 0);
        await updateJob(client, deadJob.job_id, 'maxAttempts', newMaxAttempts);
        await updateJob(client, deadJob.job_id, 'nextRunAt', new Date());

        await handleCreateJobEvent(deadJob.job_id, JOB_EVENTS.REPLAY, client);

        // await updateDeadJob(client, deadJob.id, 'status', DEAD_JOB_STATUS.REPLAYED);
        await deleteDeadJob(client, deadJob.id);

        return true;
    });
    
    store.del(allDeadJobsCacheKey(userId));
    store.del(deadJobCacheKey(userId, id));
    store.del(jobCacheKey(userId, result.jobId));
    store.delByPrefix(`user:${userId}:allJobs`);

    if(!result){
        throw new AppError("Failed to replay the dead job", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return {
        message: "dead job replayed successfully",
        data: {
            jobId: deadJob.job_id
        }
    };
}

module.exports = {
    handleCreateDeadJob,
    handleGetAllDeadJobs,
    handleGetDeadJob,
    handleReplayDeadJob
}