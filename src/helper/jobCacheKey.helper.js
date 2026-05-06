const jobCacheKey = (userId, jobId) => `user:${userId}:job:${jobId}`;
const allJobsCacheKey = (userId) => `user:${userId}:allJobs`;
const allJobsPaginationCacheKey = (userId, page, limit) => `user:${userId}:limit:${limit}:page${page}:allJobs`;
const allJobsCursorPaginationCacheKey = (userId, cursor, limit) => `user:${userId}:limit:${limit}:cursor:${cursor}:allJobs`;


module.exports = { jobCacheKey, allJobsCacheKey, allJobsPaginationCacheKey, allJobsCursorPaginationCacheKey };