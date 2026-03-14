# Caseworker Tasks API

A RESTful API for creating and managing caseworker tasks, built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and documented with **Swagger/OpenAPI 3.0**. Validation is handled by **Zod** and the test suite runs on **Vitest** with an in-memory MongoDB instance — no external test database required.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Root](#root)
  - [Health Check](#health-check)
  - [Tasks](#tasks)
- [Data Model](#data-model)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [API Documentation (Swagger)](#api-documentation-swagger)

---

## Features

- Create, partially update, and delete tasks
- Dedicated `PATCH /:id/status` endpoint for safe, isolated status transitions
- Full partial update via `PATCH /:id` — update any combination of fields in one request
- Input validation via **Zod** schemas with descriptive error messages
- Structured, consistent JSON error responses across all endpoints
- Auto-generated **OpenAPI 3.0** documentation with reusable schemas and responses (Swagger UI)
- Root and health check endpoints
- In-memory MongoDB test environment (no test database needed)

---

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Runtime    | Node.js (ESM)                              |
| Framework  | Express 4                                  |
| Database   | MongoDB via Mongoose 8                     |
| Validation | Zod 3                                      |
| API Docs   | swagger-jsdoc + swagger-ui-express         |
| Testing    | Vitest + Supertest + mongodb-memory-server |
| CORS       | cors                                       |
| Config     | dotenv                                     |
| Dev server | nodemon                                    |

---

## Project Structure

```
.
├── src/
│   ├── app.js                  # Express app factory (middleware, routes)
│   ├── server.js               # Entry point — connects DB and starts server
│   ├── config/
│   │   ├── db.js               # Mongoose connect/disconnect helpers
│   │   └── env.js              # Environment variable loading & defaults
│   ├── docs/
│   │   └── swagger.js          # OpenAPI 3.0 spec — component schemas, responses & server config
│   ├── middlewares/
│   │   ├── error.js            # Global error handler (HttpError, Mongoose errors, 500)
│   │   └── notFound.js         # 404 catch-all handler
│   ├── modules/
│   │   └── tasks/
│   │       ├── task.controller.js   # Request/response handling & Zod validation
│   │       ├── task.model.js        # Mongoose schema & model
│   │       ├── task.routes.js       # Express router with full OpenAPI JSDoc annotations
│   │       ├── task.service.js      # Business / DB logic (CRUD operations)
│   │       └── task.validation.js   # Zod schemas (create, update, updateStatus)
│   └── utils/
│       ├── asyncHandler.js     # Wraps async controllers to forward errors to Express
│       └── httpError.js        # Custom HttpError class (status + message + details)
├── test/
│   ├── setup.js                # Vitest global setup — spins up MongoMemoryServer
│   └── tasks.test.js           # Integration tests for all task endpoints
├── vitest.config.js
└── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** instance — MongoDB Atlas (cloud) or a local MongoDB installation. `MONGODB_URI` has no built-in default and **must** be set via `.env`.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (see [Environment Variables](#environment-variables) below):

```bash
cp .env.example .env   # if an example file exists, otherwise create manually
```

### 4. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:4000` by default.

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
# Application
NODE_ENV=development
PORT=4000

# MongoDB — required, no fallback
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# CORS — origin allowed to call the API
CORS_ORIGIN=http://localhost:5173
```

| Variable      | Default                 | Required | Description                     |
| ------------- | ----------------------- | -------- | ------------------------------- |
| `NODE_ENV`    | `development`           | ❌       | Runtime environment             |
| `PORT`        | `4000`                  | ❌       | Port the HTTP server listens on |
| `MONGODB_URI` | —                       | ✅       | MongoDB connection string       |
| `CORS_ORIGIN` | `http://localhost:5173` | ❌       | Allowed CORS origin             |

> ⚠️ **Never commit your `.env` file** or real credentials to version control.

---

## Running the Server

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Start with `node --watch` (auto-restart on file changes) |
| `npm start`          | Start normally (production)                              |
| `npm test`           | Run the full test suite once                             |
| `npm run test:watch` | Run tests in watch mode                                  |

---

## API Reference

### Base URL

```
http://localhost:4000
```

---

### Root

#### `GET /`

Confirms the API is reachable.

**Response `200`**

```json
{ "message": "Task API is running" }
```

---

### Health Check

#### `GET /health`

Lightweight liveness check.

**Response `200`**

```json
{ "ok": true }
```

---

### Tasks

All task endpoints are prefixed with `/api/tasks`.

---

#### `GET /api/tasks`

Retrieve all tasks, sorted by `dueAt` ascending then `createdAt` descending.

**Response `200`**

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Review case file",
    "description": "Go through all documents for case #1023",
    "status": "todo",
    "dueAt": "2026-03-20T00:00:00.000Z",
    "createdAt": "2026-03-13T10:00:00.000Z",
    "updatedAt": "2026-03-13T10:00:00.000Z"
  }
]
```

---

#### `POST /api/tasks`

Create a new task.

**Request Body**

```json
{
  "title": "Review case file",
  "description": "Go through all documents for case #1023",
  "status": "todo",
  "dueAt": "2026-03-20T00:00:00.000Z"
}
```

| Field         | Type        | Required | Constraints                                            |
| ------------- | ----------- | -------- | ------------------------------------------------------ |
| `title`       | string      | ✅       | 2–120 characters                                       |
| `description` | string      | ❌       | Max 2000 characters                                    |
| `status`      | string      | ❌       | `todo` \| `in_progress` \| `done` (defaults to `todo`) |
| `dueAt`       | date string | ✅       | Any value coercible to a JS `Date`                     |

**Response `201`** — Returns the created task object.

**Response `400`** — Validation error.

```json
{
  "message": "Invalid payload",
  "details": {
    "fieldErrors": { "title": ["String must contain at least 2 character(s)"] },
    "formErrors": []
  }
}
```

---

#### `GET /api/tasks/:id`

Retrieve a single task by its MongoDB ObjectId.

**Path Parameters**

| Param | Description                  |
| ----- | ---------------------------- |
| `id`  | MongoDB ObjectId of the task |

**Response `200`** — Returns the task object.

**Response `400`** — `id` is not a valid MongoDB ObjectId.

```json
{ "message": "Invalid ID format" }
```

**Response `404`**

```json
{ "message": "Task not found" }
```

---

#### `PATCH /api/tasks/:id`

Partially update a task. Send only the fields you want to change — at least one field is required.

**Path Parameters**

| Param | Description                  |
| ----- | ---------------------------- |
| `id`  | MongoDB ObjectId of the task |

**Request Body**

```json
{
  "title": "Updated case review",
  "dueAt": "2026-03-25T00:00:00.000Z"
}
```

| Field         | Type        | Required | Constraints                        |
| ------------- | ----------- | -------- | ---------------------------------- |
| `title`       | string      | ❌       | 2–120 characters                   |
| `description` | string      | ❌       | Max 2000 characters                |
| `status`      | string      | ❌       | `todo` \| `in_progress` \| `done`  |
| `dueAt`       | date string | ❌       | Any value coercible to a JS `Date` |

> At least one field must be present in the request body, otherwise a `400` is returned.

**Response `200`** — Returns the updated task object.

**Response `400`** — Validation error or empty body.

**Response `404`**

```json
{ "message": "Task not found" }
```

---

#### `PATCH /api/tasks/:id/status`

Update **only** the status of a task. Use this for workflow transitions.

**Path Parameters**

| Param | Description                  |
| ----- | ---------------------------- |
| `id`  | MongoDB ObjectId of the task |

**Request Body**

```json
{ "status": "in_progress" }
```

| Field    | Type   | Required | Allowed values                    |
| -------- | ------ | -------- | --------------------------------- |
| `status` | string | ✅       | `todo` \| `in_progress` \| `done` |

**Response `200`** — Returns the updated task object.

**Response `400`** — Validation error.

**Response `404`**

```json
{ "message": "Task not found" }
```

---

#### `DELETE /api/tasks/:id`

Permanently delete a task.

**Path Parameters**

| Param | Description                  |
| ----- | ---------------------------- |
| `id`  | MongoDB ObjectId of the task |

**Response `204`** — No content.

**Response `404`**

```json
{ "message": "Task not found" }
```

---

## Data Model

### Task

```
Task {
  _id         ObjectId     — auto-generated
  title       String       — required, 2–120 chars
  description String       — optional, max 2000 chars
  status      String       — "todo" | "in_progress" | "done" (default: "todo")
  dueAt       Date         — required
  createdAt   Date         — auto-managed by Mongoose timestamps
  updatedAt   Date         — auto-managed by Mongoose timestamps
}
```

### Status Lifecycle

```
todo  ──►  in_progress  ──►  done
 ▲               │             │
 └───────────────┴─────────────┘  (any transition is allowed via PATCH)
```

---

## Error Handling

All errors return a consistent JSON shape:

```json
{
  "message": "Human-readable error description",
  "details": {} // optional — present for validation errors
}
```

| HTTP Status | Cause                                            |
| ----------- | ------------------------------------------------ |
| `400`       | Failed Zod validation, invalid MongoDB ID format |
| `404`       | Resource not found, undefined route              |
| `500`       | Unexpected server error                          |

---

## Testing

Tests use **Vitest** with **Supertest** for HTTP-level integration testing and **mongodb-memory-server** for a fully isolated, real MongoDB instance — no external database or seeding required.

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

| Test case                          | What it verifies                                                     |
| ---------------------------------- | -------------------------------------------------------------------- |
| Creates and lists tasks            | `POST /api/tasks` returns 201 with correct body; `GET` returns array |
| Updates status via dedicated route | `PATCH /api/tasks/:id/status` correctly transitions status           |
| Partially updates task fields      | `PATCH /api/tasks/:id` updates individual fields (e.g. title)        |
| Rejects invalid payloads           | `POST /api/tasks` with a too-short title returns 400                 |

**Setup** (`test/setup.js`): Spins up a `MongoMemoryServer` before all tests and tears it down after — completely isolated from any real database.

---

## API Documentation (Swagger)

Interactive API documentation is auto-generated from OpenAPI 3.0 JSDoc annotations in `src/modules/**/*.js` and served via **swagger-ui-express**.

Once the server is running, open:

```
http://localhost:4000/docs
```

The Swagger spec includes:

- **Reusable schemas** — `Task`, `CreateTaskInput`, `UpdateTaskInput`, `UpdateStatusInput`, `ErrorResponse`
- **Reusable responses** — `BadRequest`, `NotFound`, `InvalidId`, `InternalError`
- **Server config** — pre-pointed at `http://localhost:4000` so the **Try it out** button works immediately
