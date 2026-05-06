CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    refresh_token TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL,
    status TEXT NOT NULL,
    attempts INT NOT NULL,
    max_attempts INT NOT NULL,
    next_run_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_jobs_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_events (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_job_events_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_jobs_worker
ON jobs (status, next_run_at, created_at);

CREATE INDEX idx_jobs_owner
ON jobs (owner_id);

CREATE INDEX idx_job_events_job
ON job_events (job_id);