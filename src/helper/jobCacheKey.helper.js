const jobCacheKey = (userId, jobId) => `user:${userId}:job:${jobId}`;
const allJobsCacheKey = (userId) => `user:${userId}:allJobs`;
const allJobsPaginationCacheKey = (userId, page, limit) => `user:${userId}:allJobs:limit:${limit}:page${page}`;
const allJobsCursorPaginationCacheKey = (userId, cursor, limit) => `user:${userId}:allJobs:limit:${limit}:cursor:${cursor}`;


module.exports = { jobCacheKey, allJobsCacheKey, allJobsPaginationCacheKey, allJobsCursorPaginationCacheKey };