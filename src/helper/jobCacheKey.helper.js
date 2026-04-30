const jobCacheKey = (userId, jobId) => `user:${userId}:job:${jobId}`;
const allJobsCacheKey = (userId) => `user:${userId}:allJobs`;

module.exports = { jobCacheKey, allJobsCacheKey };