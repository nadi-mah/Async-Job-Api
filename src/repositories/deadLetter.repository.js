const pool = require('../config/db');

const createDeadLetterJob = async(db = pool, newDeadJob) => {
    const result = await db.query(
        `INSERT INTO dead_letter_jobs (id, job_id, owner_id, reason, status, attempts, failed_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [newDeadJob.id, newDeadJob.jobId, newDeadJob.ownerId, newDeadJob.reason, newDeadJob.status, newDeadJob.attempts, newDeadJob.failedAt]
    )
    return result.rows[0];
}

const findAllDeadJobsByUserId = async(userId) => {
    const result = await pool.query(
        `SELECT * FROM dead_letter_jobs WHERE owner_id = $1`,
        [userId]
    );
    return result.rows;
}

const findDeadJobById = async(deadJobId) => {
    const result = await pool.query(
        `SELECT * FROM dead_letter_jobs WHERE id = $1`,
        [deadJobId]
    );
    // console.log(result);
    return result.rows[0];
}

const updateDeadJob = async (db = pool, deadJobId, field, newValue) => {
    const fieldMap = {
        status: 'status'
    };

    const dbField = fieldMap[field];

    if (!dbField) {
        throw new Error('Invalid field');
    }
    const result = await db.query(
        `UPDATE dead_letter_jobs SET ${dbField} = $1 WHERE id = $2 RETURNING *`,
        [newValue, deadJobId]
    );
    return result.rows[0]
}

const deleteDeadJob = async(db = pool, deadJobId) => {
    const result = await db.query(
        `DELETE from dead_letter_jobs WHERE id = $1 RETURNING *`,
        [deadJobId]
    );
    return result.rows[0];
}

module.exports = {
    createDeadLetterJob,
    findAllDeadJobsByUserId,
    findDeadJobById,
    updateDeadJob,
    deleteDeadJob
}