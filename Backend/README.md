# Caseworker Tasks API

A RESTful API for managing caseworker tasks, built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and documented with **Swagger/OpenAPI**. Validation is handled by **Zod** and the test suite runs on **Vitest** with an in-memory MongoDB instance.

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
  - [Health Check](#health-check)
  - [Tasks](#tasks)
- [Data Model](#data-model)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [API Documentation (Swagger)](#api-documentation-swagger)

---

## Features

- Create, retrieve, and delete tasks
- Update a task's status independently (workflow-safe `PATCH`)
- Input validation via **Zod** schemas
- Structured, consistent error responses
- Auto-generated **OpenAPI 3.0** documentation (Swagger UI)
- Health check endpoint
- In-memory MongoDB test environment (no test database required)

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
│   │   └── swagger.js          # swagger-jsdoc configuration
│   ├── middlewares/
│   │   ├── error.js            # Global error handler
│   │   └── notFound.js         # 404 catch-all handler
│   ├── modules/
│   │   └── tasks/
│   │       ├── task.controller.js   # Request/response handling
│   │       ├── task.model.js        # Mongoose schema & model
│   │       ├── task.routes.js       # Express router
│   │       ├── task.service.js      # Business / DB logic
│   │       └── task.validation.js   # Zod schemas
│   └── utils/
│       ├── asyncHandler.js     # Wraps async controllers to catch errors
│       └── httpError.js        # Custom HttpError class
├── vitest.config.js
└── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** instance (Atlas or local). A default Atlas URI is embedded as a fallback, but it is strongly recommended to provide your own via a `.env` file.

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

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# CORS — origin allowed to call the API
CORS_ORIGIN=http://localhost:5173
```

| Variable      | Default                 | Description                     |
| ------------- | ----------------------- | ------------------------------- |
| `NODE_ENV`    | `development`           | Runtime environment             |
| `PORT`        | `4000`                  | Port the HTTP server listens on |
| `MONGODB_URI` | Atlas fallback URI      | MongoDB connection string       |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin             |

> ⚠️ **Never commit your `.env` file** or real credentials to version control.

---

## Running the Server

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start with `--watch` (auto-restart on changes) |
| `npm start`          | Start normally (production)                    |
| `npm test`           | Run the full test suite once                   |
| `npm run test:watch` | Run tests in watch mode                        |

---

## API Reference

### Base URL

```
http://localhost:4000
```

---

### Health Check

#### `GET /health`

Confirms the server is running.

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

**Response `404`**

```json
{ "message": "Task not found" }
```

**Response `400`** — Returned when `id` is not a valid ObjectId format.

```json
{ "message": "Invalid ID format" }
```

---

#### `PATCH /api/tasks/:id/status`

Update only the status of a task.

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

Tests use **Vitest** with **Supertest** for HTTP-level integration testing and **mongodb-memory-server** for a real, isolated MongoDB instance — no external database required.

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

Test setup is configured via `vitest.config.js` and bootstrapped in `test/setup.js`.

---

## API Documentation (Swagger)

Interactive API documentation is auto-generated from JSDoc comments in the source code using **swagger-jsdoc** and served via **swagger-ui-express**.

Once the server is running, open:

```
http://localhost:4000/docs
```

The spec is built from **OpenAPI 3.0** annotations found in `src/modules/**/*.js`.
