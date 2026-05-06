const {handleCreateJob, handleGetJob, handleGetAllJobs, handleCreateBulkJobs} = require('../services/job.service');
const {handleGetAllJobEvents} = require('../services/jobEvent.service');

const {StatusCodes} = require('http-status-codes');

const store = require('../utils/inMemoryStore');

const {
    jobCacheKey, 
    allJobsCacheKey, 
    allJobsPaginationCacheKey, 
    allJobsCursorPaginationCacheKey
} = require('../helper/jobCacheKey.helper');

const createJob = async(req, res) => {
    try {
        const {userId} = req.user;

        const result = await handleCreateJob(userId);

        // const key = allJobsCacheKey(userId);
        const prefix = `user:${userId}:limit`
        // store.del(key);
        store.delByPrefix(prefix);

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

        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const cursor = req.query.cursor || null;
        
        const result = await handleGetAllJobs(userId, limit, page, cursor);

        let key = null;
        if(cursor){
            key = allJobsCursorPaginationCacheKey(userId, cursor, limit);
        }else{
            key = allJobsPaginationCacheKey(userId, page, limit);
        }
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