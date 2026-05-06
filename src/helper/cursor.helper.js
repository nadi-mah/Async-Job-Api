const parseCursor = (cursor) => {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    const [createdAt, id] = decoded.split('|');
  
    return { createdAt, id };
  };

const makeCursor = (job) => {
    const rawCursor = `${job.created_at.toISOString()}|${job.id}`;
    return Buffer.from(rawCursor).toString('base64url');
};

module.exports = {
    parseCursor,
    makeCursor
}