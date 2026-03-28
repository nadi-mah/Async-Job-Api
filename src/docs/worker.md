## Worker Processing Model
#### A background worker runs independently from API requests.

### **How it works:**
 - The worker starts when the application starts
 - It continuously runs in the background
 - Every 5 seconds, it checks the job queue
 - In the current implementation, the queue is simply the in-memory jobs list
 - Later, this can be replaced by a database, Redis, or a real message broker such as RabbitMQ


### **Job Processing Flow:**
When the worker finds an **eligible job** — meaning a job that:
- is in `pending` status
- has `attempts` less than `maxAttempts`
- and its `nextRunAt` has already passed

it will:

1. Pick the first eligible job
2. Change its status to `processing`
3. Increase its `attempts` count
4. Simulate the processing

If the process succeeds, the job status changes to `done`.

If the process fails, and the new attempt count is still less than `maxAttempts`, the job goes back to `pending` again and its `nextRunAt` is set to **5 seconds later**, so it can be picked up and processed again in the next cycle.

If the job has already reached its `maxAttempts`, its status changes to `failed`.

### **Current Worker Behavior:**
#### The current worker is serial. This means:
 - It processes only one job at a time.
#### Why this is useful:
 - Simpler logic
 - Easier debugging
 - Predictable processing order
 - Lower chance of race conditions


#### **Why Serial Processing Helps:**
Since only one job is processed at a time:
 - Two workers cannot update the same job simultaneously
 - Job state transitions remain predictable
 - Shared in-memory data is less likely to become inconsistent
This is especially useful in the current stage of the project, where jobs are stored in memory and no locking mechanism exists yet.