const store = require('../utils/inMemoryStore');
const {StatusCodes} = require('http-status-codes');

const cachedJobs = async(req, res, next) => {
    const {id} = req.params;
    const {userId} = req.user;

    const key = `user:${userId}:job:${id}`;

    const cachedJob = store.get(key);

    if(cachedJob){
        return res.status(StatusCodes.OK).json({data: cachedJob})
    }else{
        next()
    }
}

module.exports = cachedJobs;
