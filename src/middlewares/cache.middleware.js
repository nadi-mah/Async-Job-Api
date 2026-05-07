const store = require('../utils/inMemoryStore');
const {StatusCodes} = require('http-status-codes');

const {
    jobCacheKey, 
    allJobsCacheKey, 
    allJobsPaginationCacheKey, 
    allJobsCursorPaginationCacheKey
} = require('../helper/jobCacheKey.helper');
const { allDeadJobsCacheKey, deadJobCacheKey } = require('../helper/deadJobsCacheKey.helper');

const cachedJobs = async(req, res, next) => {
    const {id} = req.params;
    const {userId} = req.user;

    // const key = `user:${userId}:job:${id}`;
    const key = jobCacheKey(userId, id);

    const cachedJob = store.get(key);

    if(cachedJob){
        return res.status(StatusCodes.OK).json({data: cachedJob, way: "with cache"})
    }else{
        next()
    }
}

const cacheAllJobs = async(req, res, next) => {
    const {userId} = req.user;

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const cursor = req.query.cursor || null;

    let key = null;

    if(cursor){
        key = allJobsCursorPaginationCacheKey(userId, cursor, limit);
    }else{
        key = allJobsPaginationCacheKey(userId, page, limit);
    }
    
    const cachedJobsData = store.get(key);
    

    if(cachedJobsData !== null){
        return res.status(StatusCodes.OK).json({data: cachedJobsData, way: "with cache"})
    }else{
        next()
    }
} 

const cacheAllDeadJobs = async(req, res, next) => {
    const {userId} = req.user;

    const key = allDeadJobsCacheKey(userId);
    const cachedJobsData = store.get(key);

    if(cachedJobsData !== null){
        return res.status(StatusCodes.OK).json({data: cachedJobsData, way: "with cache"})
    }else{
        next()
    }
}

const cacheDeadJobs = async(req, res, next) => {
    const {id} = req.params;
    const {userId} = req.user;

    const key = deadJobCacheKey(userId, id);

    const cachedJob = store.get(key);

    if(cachedJob){
        return res.status(StatusCodes.OK).json({data: cachedJob, way: "with cache"})
    }else{
        next()
    }
}

module.exports = {cachedJobs,  cacheAllJobs, cacheAllDeadJobs, cacheDeadJobs};
