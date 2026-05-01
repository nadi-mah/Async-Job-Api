const pool = require('../config/db');
const {JOB_STATUS} = require('../constants/job.constant');
// const jobs = [];


// const findJobById = (jobId) => {
//     return jobs.find(job => job.id === jobId);
// }
const findJobById = async (jobId) => {
    const result = await pool.query(
        'SELECT * FROM jobs WHERE id = $1',
        [jobId]
    );
    return result.rows[0];
}

// const findAllJobsByUserId = (userId) => {
//     return jobs.filter(job => job.ownerId === userId);
// }
const findAllJobsByUserId = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM jobs WHERE owner_id = $1',
        [userId]
    );
    return result.rows;

}

// const findPendingAndEligibleJobs = () => {
//     return jobs.filter(job => 
//         job.status === 'pending' && 
//         job.nextRunAt <= new Date()  && 
//         job.attempts < job.maxAttempts);
// }
const findPendingAndEligibleJobs = async () => {
    const result = await pool.query(
        'SELECT * FROM jobs WHERE status = $1 AND next_run_at <= $2 AND  attempts < max_attempts',
        [JOB_STATUS.PENDING, new Date()]
    );
    return result.rows;
}

// const createJob = (newJob) => {
//     jobs.push(newJob);
//     return true;
// }
const createJob = async (db, newJob) => {
    const result = await db.query(
        'INSERT INTO jobs (id, owner_id, status, attempts, max_attempts, next_run_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [newJob.id, newJob.ownerId, newJob.status, newJob.attempts, newJob.maxAttempts, newJob.nextRunAt, newJob.createdAt, newJob.updatedAt]

    );
    return result.rows[0];
}


// const updateJob = (jobId, field, newValue) => {
//     const index = jobs.findIndex(job => job.id === jobId);
//     if(index === -1){
//         return null;
//     } 
//     jobs[index] = {
//         ...jobs[index],
//         [field]: newValue,
//         updatedAt: new Date()
//     };

// }
const updateJob = async (db = pool, jobId, field, newValue) => {
    const fieldMap = {
        status: 'status',
        attempts: 'attempts',
        nextRunAt: 'next_run_at'
    };

    const dbField = fieldMap[field];

    if (!dbField) {
        throw new Error('Invalid field');
    }
    const result = await db.query(
        `UPDATE jobs SET ${dbField} = $1 WHERE id = $2 RETURNING *`,
        [newValue, jobId]
    );
    return result.rows[0]
}

const claimEligibleJobs = async(db = pool, limit) => {
    const result = await db.query(
        `
        WITH picked AS (
          SELECT id
          FROM jobs
          WHERE status = $1
            AND next_run_at <= NOW()
            AND attempts < max_attempts
          ORDER BY created_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT $2
        )
        UPDATE jobs
        SET 
          status = $3,
          attempts = attempts + 1,
          updated_at = NOW()
        WHERE id IN (SELECT id FROM picked)
        RETURNING *
        `,
        [JOB_STATUS.PENDING, limit, JOB_STATUS.PROCESSING]
      );
    return result.rows;
}

module.exports = {
    createJob,
    findJobById,
    findAllJobsByUserId,
    findPendingAndEligibleJobs,
    updateJob,
    claimEligibleJobs
}