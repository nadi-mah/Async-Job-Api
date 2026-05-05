## Running the Project

This project has two separate runtime parts:

1. **API Server**  
   Handles HTTP requests like auth, creating jobs, reading jobs, dashboard, etc.

2. **Worker Process**  
   Runs in the background and processes pending jobs.

The API and workers should be started in separate terminal tabs.

---

### 1. Start the API Server

```bash
npm run dev
```

The API server will start on the configured port, usually:

```bash
http://localhost:3000
```

### 2. Start Worker Processes

Each worker is a separate process.
You can run one or multiple workers at the same time.

**Start worker 1**

```bash
WORKER_ID=worker-1 npm run worker
```

**Start worker 2**

```bash
WORKER_ID=worker-2 npm run worker
```

### Example Runtime Setup

Open three terminal tabs:

```bash
Terminal 1 → npm run dev
Terminal 2 → WORKER_ID=worker-1 npm run worker
Terminal 3 → WORKER_ID=worker-2 npm run worker
```

With this setup:

```bash
API server handles client requests
worker-1 processes jobs in the background
worker-2 processes jobs in the background
```