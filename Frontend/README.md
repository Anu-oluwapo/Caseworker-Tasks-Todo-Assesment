<div align="center">

# 🗂️ Caseworker Tasks

**A sleek, full-featured task management SPA built with Vue 3, Pinia, and Tailwind CSS.**

[![Vue](https://img.shields.io/badge/Vue-3.x-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.x-ffd859?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Unit-Vitest-6e9f18?logo=vitest&logoColor=white)](https://vitest.dev/)

</div>

---

## ✨ Features

| Feature               | Description                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| 📋 **Task list**      | Scrollable list of all tasks sorted by due date                                                     |
| ➕ **Create tasks**   | Form with title, optional description, and due date/time                                            |
| ✏️ **Edit tasks**     | Click any card to open an edit modal pre-filled with existing data                                  |
| 🗑️ **Delete tasks**   | Trash-icon button with a confirmation dialog before deletion                                        |
| 🔄 **Status changes** | Inline dropdown on every card to switch between statuses                                            |
| 🏷️ **Kanban board**   | Three-column board grouped by status (`To do`, `In progress`, `Done`)                               |
| 🖱️ **Drag & drop**    | Drag task cards between board columns to update status instantly                                    |
| 🌗 **Dark mode**      | Animated sun→moon toggle persisted to `localStorage`; respects `prefers-color-scheme` on first load |
| ♿ **Accessible**     | Semantic HTML, ARIA roles, keyboard navigation on interactive cards                                 |

---

## 🛠️ Tech Stack

| Layer       | Technology                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Framework   | [Vue 3](https://vuejs.org/) with `<script setup>` + Composition API                                                    |
| Language    | TypeScript (strict)                                                                                                    |
| Build tool  | [Vite 7](https://vite.dev/)                                                                                            |
| State       | [Pinia 3](https://pinia.vuejs.org/)                                                                                    |
| Routing     | [Vue Router 5](https://router.vuejs.org/)                                                                              |
| Styling     | [Tailwind CSS 3](https://tailwindcss.com/) + [`@tailwindcss/forms`](https://github.com/tailwindlabs/tailwindcss-forms) |
| Unit tests  | [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) + jsdom                                |
| E2E tests   | [Playwright](https://playwright.dev/) (Chromium, Firefox, WebKit)                                                      |
| Dev tooling | [Vue DevTools](https://devtools.vuejs.org/) (Vite plugin), Prettier                                                    |

---

## 📁 Project Structure

```
src/
├── api/
│   └── http.js            # Thin fetch wrapper (GET / POST / PATCH / DELETE)
├── components/
│   ├── ConfirmDialog.vue  # Reusable "are you sure?" modal
│   ├── TaskCard.vue       # Individual task card (click-to-edit, drag, status, delete)
│   ├── TaskForm.vue       # Dual-mode form — create or edit a task
│   └── TaskList.vue       # Renders a list of TaskCards and bubbles events up
├── router/
│   └── index.js           # Single route: / → TasksView
├── stores/
│   └── task.store.js      # Pinia store (fetchAll, createTask, updateTask, updateStatus, deleteTask)
├── types/
│   └── task.ts            # Task & TaskStatus TypeScript types
├── views/
│   └── TasksView.vue      # Main view — orchestrates all components and state
├── App.vue                # Root component (router-view)
├── index.css              # Tailwind base/components/utilities directives
└── main.js                # App entry point
```

---

## ⚙️ Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0`
- **npm** (bundled with Node)
- A running **backend API** at `http://localhost:4000` (or set `VITE_API_BASE` below)

---

## 🚀 Getting Started

### 1 — Clone & install

```bash
git clone <your-repo-url>
cd Frontend
npm install
```

### 2 — Configure the API base URL _(optional)_

By default the app talks to `http://localhost:4000`. To point it at a different backend, create a `.env.local` file:

```env
VITE_API_BASE=http://localhost:4000
```

### 3 — Start the development server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Script                    | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`             | Start the Vite dev server with HMR                                        |
| `npm run build`           | Build the app for production into `dist/`                                 |
| `npm run preview`         | Preview the production build locally                                      |
| `npm run storybook`       | Start Storybook at `http://localhost:6006` (**primary testing workflow**) |
| `npm run build-storybook` | Build static Storybook output for CI/release validation                   |
| `npm run format`          | Format all source files with Prettier                                     |

---

## 🧪 Storybook Testing

This project uses **CSF3 stories + play functions** as the main interaction-testing workflow.

### 1) Start Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006).

### 2) Run interaction tests from the Storybook UI

For each story:

- Open the story in the left sidebar
- View the **Interactions** panel to see each play step
- Check the **A11y** panel for accessibility issues
- Use the **Tests** panel (from addon-vitest) to verify pass/fail state

This is especially useful for stories that validate:

- emitted events (`@open`, `@delete`, `@status`, `@submit`, `@confirm`, `@cancel`)
- mocked API/store behavior (`fn()`, `mockReturnValue`, `mockResolvedValue`)
- keyboard/click flows and modal behavior

### 3) Build Storybook for CI/release validation

```bash
npm run build-storybook
```

This ensures all stories compile correctly in a production Storybook build.

### Where stories live

- Component stories: `src/components/*.stories.ts`
- View stories: `src/views/*.stories.ts`
- App shell story: `src/App.stories.ts`

---

## 🗺️ Architecture & Data Flow

```
TasksView (orchestrator)
│
├── TaskForm           ← create mode (emits @submit → store.createTask)
│
├── TaskList           ← scrollable all-tasks panel
│   └── TaskCard[]     ← emits @open, @status, @delete
│
├── [Board by status]  ← 3 × kanban column, drag & drop
│   └── TaskList       ← per-column task cards (same component, drag wrapper)
│
├── TaskForm (modal)   ← edit mode, pre-filled, emits @submit → store.updateTask
└── ConfirmDialog      ← delete confirmation
```

### State (Pinia — `task.store.js`)

| Action                     | HTTP call                     | Effect                            |
| -------------------------- | ----------------------------- | --------------------------------- |
| `fetchAll()`               | `GET /api/tasks`              | Replaces `items[]`                |
| `createTask(payload)`      | `POST /api/tasks`             | Prepends + re-sorts `items[]`     |
| `updateTask(id, payload)`  | `PATCH /api/tasks/:id`        | Updates matching item in-place    |
| `updateStatus(id, status)` | `PATCH /api/tasks/:id/status` | Updates `status` of matching item |
| `deleteTask(id)`           | `DELETE /api/tasks/:id`       | Removes item from `items[]`       |

### API helper (`src/api/http.js`)

A minimal `fetch` wrapper that:

- Prefixes every request with `VITE_API_BASE` (default `http://localhost:4000`)
- Always sends `Content-Type: application/json`
- Throws a descriptive `Error` on non-`2xx` responses
- Returns `undefined` on `204 No Content`

---

## 🧩 Component Reference

### `TaskForm.vue`

A dual-mode form component reused for both creating and editing tasks.

| Prop            | Type                             | Default         | Description                                           |
| --------------- | -------------------------------- | --------------- | ----------------------------------------------------- |
| `mode`          | `'create' \| 'edit'`             | `'create'`      | Controls reset-on-submit and Cancel button visibility |
| `heading`       | `string`                         | `'Create task'` | Card heading text                                     |
| `submitLabel`   | `string`                         | `'Add task'`    | Submit button label                                   |
| `initialValues` | `{ title, description?, dueAt }` | —               | Pre-fills fields in edit mode                         |

**Events:** `@submit(payload)`, `@cancel`

---

### `TaskCard.vue`

Interactive card for a single task.

- **Click / Enter / Space** → emits `@open` to trigger the edit modal
- **Status select** → emits `@status` (stops propagation so it doesn't open the modal)
- **Trash button** → emits `@delete` (stops propagation)
- Status badge is colour-coded: `todo` = slate, `in_progress` = amber, `done` = emerald

---

### `TaskList.vue`

Thin wrapper that renders a list of `TaskCard`s and bubbles all events (`@status`, `@delete`, `@open`) up to the parent.

---

### `ConfirmDialog.vue`

A blocking modal for destructive confirmations.

| Prop      | Type      | Description         |
| --------- | --------- | ------------------- |
| `open`    | `boolean` | Controls visibility |
| `title`   | `string`  | Dialog heading      |
| `message` | `string`  | Body text           |

**Events:** `@confirm`, `@cancel`

---

## 🌗 Dark Mode

Dark mode is implemented using Tailwind's `class` strategy:

- The `dark` class is toggled on `<html>` via the animated sun→moon switch in the header.
- The preference is written to `localStorage` under the key `theme`.
- On page load, the app reads `localStorage` first; if no preference is saved it falls back to the OS-level `prefers-color-scheme` media query.

---

## 🤝 IDE Setup

| Tool       | Recommendation                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Editor     | [VS Code](https://code.visualstudio.com/)                                                                                              |
| Vue plugin | [Vue — Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur if installed)                           |
| Browser    | Chrome/Edge/Brave + [Vue DevTools extension](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) |

---

<div align="center">

Made with ❤️ using Vue 3 + Vite

</div>
