### Job Event Log
The `JobEvent` entity is used to record all significant state transitions of a job.
Storing events allows us to:
 - Track the full lifecycle of a job
 - Improve debugging
 - Provide observability into asynchronous processing


### **jobEvent model:**
```javascript
    {
        id: string,
        jobId: string,
        type: 'JOB_CREATED' | 'JOB_PROCESSING_STARTED' | 'JOB_COMPLETED' | 'JOB_FAILED' | 'JOB_RETRY_SCHEDULED',
        createdAt: Date,
    }
```
*Note: Events are immutable records representing what happened, not the current state.*

### **Accessing Job Events:**

```javascript
GET /jobs/:id/events
```
 - Returns all events related to a specific job
 - Protected route
 - Only accessible by the owner of the job
