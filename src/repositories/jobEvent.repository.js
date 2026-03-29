const pool = require('../config/db');
// const jobEvents = [];

// const findJobEventByJobId = (jobId) => {
//     return jobEvents.filter(jobEvent => jobEvent.jobId === jobId);
// }
const findJobEventByJobId = async (jobId) => {
    const result = await pool.query(
        'SELECT * FROM job_events WHERE id = $1',
        [jobId]
    );
    return result.rows[0];
}

// const createJobEvent = (newEvent) => {
//     jobEvents.push(newEvent);
//     return newEvent;
// }
const createJobEvent = async (newEvent) => {
    const result = await pool.query(
        'INSERT INTO job_events (id, job_id, type, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [newEvent.id, newEvent.jobId, newEvent.type, newEvent.createdAt]
    );
    return result.rows[0];
}


module.exports = {
    findJobEventByJobId,
    createJobEvent
}