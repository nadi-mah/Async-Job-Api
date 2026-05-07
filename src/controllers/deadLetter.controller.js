const {handleGetAllDeadJobs, handleGetDeadJob, handleReplayDeadJob} = require('../services/deadLetter.service');

const { allDeadJobsCacheKey, deadJobCacheKey } = require('../helper/deadJobsCacheKey.helper');

const store = require('../utils/inMemoryStore');

const {StatusCodes} = require('http-status-codes');

const getDeadLetterJobs = async(req, res) => {
    try {
        const {userId} = req.user;
        const result = await handleGetAllDeadJobs(userId);

        const key = allDeadJobsCacheKey(userId);
        const ttl = 15 * 1000;
        store.set(key, result.deadJobs, ttl);

        return res.status(StatusCodes.OK).json({data: result.deadJobs});
        
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}
const getDeadJob = async(req, res) => {
    try {
        const {userId} = req.user;
        const {id} = req.params;

        const result = await handleGetDeadJob(userId, id);

        const key = deadJobCacheKey(userId, id);
        const ttl = 15 * 1000;
        store.set(key, result.data, ttl);

        return res.status(StatusCodes.OK).json(result);

    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}

const replayDeadJob = async(req, res) => {
    try {
        const {userId} = req.user;
        const {id} = req.params;
    
        const newMaxAttempts = req.body.maxAttempts ?? 3;
        if (!Number.isInteger(newMaxAttempts) || newMaxAttempts <= 0) {
            throw new AppError("maxAttempts must be a positive integer", StatusCodes.BAD_REQUEST);
        }

        const result = await handleReplayDeadJob(userId, id, newMaxAttempts);

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}

module.exports = {
    getDeadLetterJobs,
    getDeadJob,
    replayDeadJob
}