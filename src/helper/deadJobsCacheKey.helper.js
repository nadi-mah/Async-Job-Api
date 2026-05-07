const allDeadJobsCacheKey = (userId) => `user:${userId}:allDeadJobs`;
const deadJobCacheKey = (userId, deadJobId) => `user:${userId}:deadJob:${deadJobId}`;


module.exports = {allDeadJobsCacheKey, deadJobCacheKey};