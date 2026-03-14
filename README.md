# Ministry of Justice — Software Developer Technical Assessment

This repository contains my submission for the **Software Developer** position at the **UK's Ministry of Justice**. It implements a full-stack caseworker task management application across two self-contained workspaces: a REST API backend and a Vue 3 single-page frontend.

---

## Repository Structure

```
.
├── Backend/    # Node.js/Express REST API
└── Frontend/   # Vue 3 SPA
```

---

## Overview

### Backend — Caseworker Tasks API

A RESTful API for creating and managing caseworker tasks, built with **Node.js (ESM)**, **Express 4**, and **MongoDB (Mongoose)**. Input validation is handled by **Zod** and the API is fully documented with an interactive **Swagger/OpenAPI 3.0** UI.

**Key features:**

- Full CRUD for tasks (`GET`, `POST`, `PATCH`, `DELETE`)
- Dedicated `PATCH /:id/status` endpoint for isolated status transitions
- Structured, consistent JSON error responses
- Auto-generated OpenAPI 3.0 docs served at `/docs`
- Integration test suite (Vitest + Supertest + in-memory MongoDB — no external DB needed)

**Tech stack:** Node.js · Express 4 · MongoDB/Mongoose 8 · Zod 3 · Vitest · Supertest · swagger-jsdoc · swagger-ui-express

**Base URL:** `http://localhost:4000`  
**Docs:** `http://localhost:4000/docs`

---

### Frontend — Caseworker Tasks SPA

A full-featured single-page application built with **Vue 3**, **Pinia**, and **Tailwind CSS**. It consumes the backend API and provides a rich task management UI.

**Key features:**

- Scrollable task list sorted by due date
- Create, edit, and delete tasks with confirmation dialogs
- Inline status updates via dropdown
- Kanban board view grouped by status (`To do`, `In progress`, `Done`) with **drag-and-drop** support
- Animated dark mode toggle persisted to `localStorage`
- Accessible — semantic HTML, ARIA roles, keyboard navigation, `data-testid` attributes
- Component-level interaction tests via **Storybook** (CSF3 + `play` functions) and automated **accessibility audits**

**Tech stack:** Vue 3 · Vite 7 · Pinia 3 · Vue Router 5 · TypeScript · Tailwind CSS 3 · Storybook 10

**Dev server:** `http://localhost:5173`  
**Storybook:** `http://localhost:6006`

---

## Getting Started

Both the backend and frontend must be running for the full application to work. Start the backend first.

### 1. Backend

```bash
cd Backend
npm install
cp env.example .env   # then fill in your MONGODB_URI
npm run dev
```

> See [Backend/README.md](Backend/README.md) for the full environment variable reference and API documentation.

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

> By default the frontend expects the API at `http://localhost:4000`. See [Frontend/README.md](Frontend/README.md) to configure a different base URL.

---

## Running Tests

### Backend (Vitest + Supertest)

```bash
cd Backend
npm test              # run once
npm run test:watch    # watch mode
```

### Frontend (Storybook interaction tests)

```bash
cd Frontend
npm run storybook     # open http://localhost:6006 and view the Interactions/Tests panels
```

---

## Environment Variables

### Backend (`.env`)

| Variable      | Default                 | Required | Description               |
| ------------- | ----------------------- | -------- | ------------------------- |
| `NODE_ENV`    | `development`           | ❌       | Runtime environment       |
| `PORT`        | `4000`                  | ❌       | HTTP server port          |
| `MONGODB_URI` | —                       | ✅       | MongoDB connection string |
| `CORS_ORIGIN` | `http://localhost:5173` | ❌       | Allowed CORS origin       |

### Frontend (`.env.local`)

| Variable        | Default                 | Required | Description          |
| --------------- | ----------------------- | -------- | -------------------- |
| `VITE_API_BASE` | `http://localhost:4000` | ❌       | Backend API base URL |

---

## Prerequisites

| Requirement | Backend       | Frontend                    |
| ----------- | ------------- | --------------------------- |
| Node.js     | v18 or higher | `^20.19.0` or `>=22.12.0`   |
| npm         | v9 or higher  | Bundled with Node           |
| MongoDB     | ✅ Required   | ❌ (handled by the backend) |

---

## Further Reading

- [Backend README](Backend/README.md) — full API reference, data model, error handling, Swagger docs
- [Frontend README](Frontend/README.md) — component reference, Storybook testing guide, architecture & data flow, dark mode, accessibility
