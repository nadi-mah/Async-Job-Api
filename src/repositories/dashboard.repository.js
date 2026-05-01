const pool = require('../config/db');

const getJobStatsByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total_jobs,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'processing')::int AS processing,
      COUNT(*) FILTER (WHERE status = 'done')::int AS done,
      COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
      COUNT(*) FILTER (
        WHERE status = 'pending' 
        AND attempts > 0 
        AND attempts < max_attempts
      )::int AS retrying_jobs
    FROM jobs
    WHERE owner_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};

module.exports = {
  getJobStatsByUserId
};