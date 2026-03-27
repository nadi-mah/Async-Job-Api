### **Overview:**
#### This project is an **asynchronous job processing API**. Clients can create jobs, which are stored and later processed by the system.

### **Key concepts:**
 - Authentication & Authorization
 - Each job has an owner => Authorization
 - Users can only access their own jobs

### **Job model:**
```javascript
    {
        id: string,
        ownerId: string,
        status: 'pending' | 'processing' | 'done' | 'failed',
        createdAt: Date,
        updatedAt: Date
    }
```
- *Note: ownerId is derived from the authenticated user (JWT), not from client input*
### **API Endpoints:**

**create a job**

```javascript
POST /jobs
```
 - Protected route
 - Creates a new job for the authenticated user

**Get All Jobs (Owned by User)**

```javascript
GET /jobs
```
 - Protected route
 - Returns only jobs belonging to the current user

**Get Single Job**

```javascript
GET /job/:id
```
 - Protected route
 - Returns the job only if it belongs to the current user