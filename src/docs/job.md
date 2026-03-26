### **Overview:**
#### This project is for enterning jobs from client and put them in the queue for processing.
 - focus on authorization, to establish ownership of each job
 - only the owner of a job can see their jobs

 - Job model:
    ```javascript
    (id, ownerId, status, createdAt, updatedAt)
    ```

### **Flow:**

**create a job**

```javascript
POST /jobs
```

**read jobs**

```javascript
GET /jobs
```

**read a job**

```javascript
GET /job/:id
```