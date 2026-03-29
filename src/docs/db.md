### Indexing

Indexing helps the database find data faster.

Instead of scanning the whole table every time, PostgreSQL can use an index to locate the matching rows quicker.

This becomes especially useful for queries that are called often, like:
- finding a user by username
- finding all jobs of a user
- finding pending jobs for the worker
- finding all events of a job

---

### Default indexes created by PostgreSQL

PostgreSQL automatically creates indexes for:
- `PRIMARY KEY`
- `UNIQUE` fields

So based on the current schema, these indexes already exist:

- `job_events_pkey`
- `jobs_pkey`
- `users_pkey`
- `users_username_key`

---

### Custom indexes added for this project

In addition to the default ones, some extra indexes are created based on the actual query patterns of the app.

---

#### `idx_jobs_worker`

```sql
SELECT * FROM jobs
WHERE status = $1
AND next_run_at <= $2
AND attempts < max_attempts
ORDER BY created_at ASC;
```

This index is created to support the worker query.
The worker frequently looks for:
 - jobs in `pending` status
 - jobs whose `next_run_at` has already passed
 - and processes them in order of `created_at`
So this index helps the worker pick eligible jobs faster.


#### `idx_jobs_owner`

```sql
SELECT * FROM jobs WHERE owner_id = $1;
```

This index is used for fetching all jobs that belong to a specific user.
This is useful for endpoints like:
```javascript
GET /jobs
```
where a user only sees their own jobs.

#### `idx_job_events_job`

```sql
SELECT * FROM job_events WHERE job_id = $1;
```

This index is used for fetching all events of a specific job.
This is useful for endpoints like:
```javascript
GET /jobs/:id/events
```
where the full lifecycle of a job is returned.

Having indexes improves read performance, but adding too many indexes can slow down:
 - INSERT
 - UPDATE
 - DELETE

So indexes should only be added for queries that are actually important and frequently used.
