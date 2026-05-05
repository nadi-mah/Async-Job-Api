const jobCacheKey = (userId, jobId) => `user:${userId}:job:${jobId}`;
const allJobsCacheKey = (userId) => `user:${userId}:allJobs`;
const allJobsPaginationCacheKey = (userId, page, limit) => `user:${userId}:page:${page}:limit${limit}:allJobs`

module.exports = { jobCacheKey, allJobsCacheKey, allJobsPaginationCacheKey };