# Async Job API

A backend learning project built with **Node.js**, **Express**, and **PostgreSQL**.

The main goal of this project is to learn backend concepts by building a real asynchronous job processing system.

The project includes:

- Authentication with JWT
- Refresh token flow
- Protected routes
- PostgreSQL with raw `pg`
- Layered architecture
- Job queue simulation
- Background worker processes
- Retry mechanism
- Dead letter jobs
- Job event log
- Transactions
- Indexing
- Caching simulation
- Rate limiting
- Offset and cursor pagination
- Concurrent workers
- Typed jobs with payload and result

---

## Project Overview

Users can create jobs through the API.

Jobs are stored in PostgreSQL with `pending` status.

Worker processes run separately from the API server and pick eligible jobs in the background.

Each job goes through a lifecycle:

```text
pending → processing → done / failed
```

If a job fails but still has retry attempts left, it is scheduled again.

If a job reaches its maximum attempts and still fails, it is moved to the dead letter jobs table.

---

## Runtime Parts

This project has two separate runtime parts:

### 1. API Server

Handles HTTP requests like:
 - auth
 - creating jobs
 - reading jobs
 - dashboard
 - dead letter jobs
 - replaying failed jobs

### 2. Worker Process

Runs in the background and processes pending jobs.

Workers are started separately from the API server.

Multiple workers can run at the same time.

---

## Running the Project

The API server and workers should be started in separate terminal tabs.

### Start the API Server

```bash
   npm run dev
```

The API server will start on the configured port, usually:

```http
   http://localhost:3000
```

---

### Start Worker Processes

Each worker is a separate process.

You can run one or multiple workers at the same time.

#### Start worker 1

```bash
   WORKER_ID=worker-1 npm run worker
```

#### Start worker 2

```bash
   WORKER_ID=worker-2 npm run worker
```

---

## Documentation

More detailed documentation is available in the docs folder:

- [Authentication](src/docs/auth.md)
- [Caching](src/docs/cache.md)
- [Database](src/docs/db.md)
- [Jobs](src/docs/job.md)
- [Job Events](src/docs/jobEvent.md)
- [Workers](src/docs/worker.md)

## Current Phase

The Express phase of this project is complete.

The next phase is migrating the project to NestJS and comparing how the same backend concepts are structured in a framework with modules, providers, guards, pipes, and dependency injection.

