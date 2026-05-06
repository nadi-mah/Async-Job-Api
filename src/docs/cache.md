## Caching Implementation

Caching is implemented with an in-memory Redis-like store.

---

### Cached Endpoints

#### Single Job

```javascript
    GET /jobs/:id
```

Cache key:
```javascript
    user:{userId}:job:{jobId}
```

#### User Jobs List

```javascript
    GET /jobs
```
Because this endpoint supports pagination, the cache key must include the pagination parameters.
Otherwise, different requests like `limit=5` and `limit=10` may incorrectly return the same cached result.

**Without Pagination:**

Cache key:
```javascript
    user:{userId}:allJobs
```
**Offset Pagination:**

Request example:
```javascript
    GET /jobs?limit=10&page=1
```
Cache key:
```javascript
    user:{userId}:allJobs:limit:{limit}:page:{page}
```
Example:
```javascript
    user:123:allJobs:limit:10:page:1
```
**Cursor Pagination:**

Request example:
```javascript
    GET /jobs?limit=10&cursor={cursor}
```
Cache key:
```javascript
    user:{userId}:allJobs:limit:{limit}:cursor:{cursor}
```
Example:
```javascript
    user:123:allJobs:limit:10:cursor:eyJjcmVhdGVkQXQiOi...
```

**Cache Invalidation:**

When a job is created or when the worker changes a job status, all cached job-list pages for that user should be invalidated by prefix:

```javascript
    user:{userId}:allJobs
```
This removes all cached variations of the user’s job list, including different `limit`, `page`, and `cursor` values.

### Rate Limiting


...