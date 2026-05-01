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

Cache key:
```javascript
    user:{userId}:jobs
```

both cached endpoint will delete when the job worker changes jobs states and when a new job is created.

### Rate Limiting

