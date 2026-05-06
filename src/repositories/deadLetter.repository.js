const pool = require('../config/db');

const createDeadLetterJob = async(db = pool, newDeadJob) => {
    const result = await db.query(
        `INSERT INTO dead_letter_jobs (id, job_id, owner_id, reason, attempts, failed_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [newDeadJob.id, newDeadJob.jobId, newDeadJob.ownerId, newDeadJob.reason, newDeadJob.attempts, newDeadJob.failedAt]
    )
    return result.rows[0];
}

module.exports = {
    createDeadLetterJob
}