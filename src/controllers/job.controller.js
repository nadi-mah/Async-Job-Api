const {handleCreateJob, handleGetJob, handleGetAllJobs, handleCreateBulkJobs} = require('../services/job.service');
const {handleGetAllJobEvents} = require('../services/jobEvent.service');

const {StatusCodes} = require('http-status-codes');

const store = require('../utils/inMemoryStore');

const {jobCacheKey, allJobsCacheKey} = require('../helper/jobCacheKey.helper');

const createJob = async(req, res) => {
    try {
        const {userId} = req.user;

        const result = await handleCreateJob(userId);

        const key = allJobsCacheKey(userId);
        store.del(key);

        return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }

}

const getJob = async(req, res) => {
    try {
        const {userId} = req.user;
        const {id} = req.params;

        const result = await handleGetJob(userId, id);

        const key = jobCacheKey(userId, id);
        const ttl = 15 * 1000;
        store.set(key, result.data, ttl);
    
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }

}

const getAllJobs = async(req, res) => {
    try {
        const {userId} = req.user;
        
        const result = await handleGetAllJobs(userId);

        const key = allJobsCacheKey(userId);
        const ttl = 15 * 1000;
        store.set(key, result.data, ttl);

        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}

const getAllJobEvents = async (req, res) => {
    try {
        const {userId} = req.user;
        const {id} = req.params;
        
        const result = await handleGetAllJobEvents(userId, id);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    } 
}

const createBulkJobs  = async (req, res) => {
    try {
        const {userId} = req.user;
        const {count} = req.body;

        const result = await handleCreateBulkJobs(userId, count);

        res.status(StatusCodes.CREATED).json(result);


    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}

module.exports = {
    createJob,
    getJob,
    getAllJobs,
    getAllJobEvents,
    createBulkJobs
}