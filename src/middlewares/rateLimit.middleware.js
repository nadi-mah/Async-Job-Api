// Rate limit middleware factory

const store = require('../utils/inMemoryStore');
const {StatusCodes} = require('http-status-codes');

const createRateLimiter = ({windowMs, maxRequests, keyPrefix}) => {
    return (req, res, next) => {
        const ip = req.ip;
        const key = `${keyPrefix}:${ip}`;

        const requestCount = store.incr(key, windowMs);

        if(requestCount > maxRequests){
            res.status(StatusCodes.TOO_MANY_REQUESTS).json({
                message: 'Too many requests. Please try again later.'
            })
        }
        next();
    }
} 

module.exports = {
    createRateLimiter
}