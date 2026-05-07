const JOB_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    DONE: 'done',
    FAILED: 'failed'
};

const JOB_EVENTS = {
    CREATED: 'JOB_CREATED',
    PROCESSING_STARTED: 'JOB_PROCESSING_STARTED',
    COMPLETED: 'JOB_COMPLETED',
    FAILED: 'JOB_FAILED',
    RETRY: 'JOB_RETRY_SCHEDULED',
    REPLAY: 'JOB_REPLAYED'
};
const DEAD_JOB_STATUS = {
    ACTIVE: 'active',
    REPLAYED: 'replayed',
    IGNORED: 'ignored'
}

module.exports = {
    JOB_STATUS,
    JOB_EVENTS,
    DEAD_JOB_STATUS
}