<div align="center">

# 🗂️ Caseworker Tasks

**Frontend for Caseworker-Tasks: Assessment by Ministry of Justice, built with Vue 3, Pinia, and Tailwind CSS.**

[![Vue](https://img.shields.io/badge/Vue-3.x-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.x-ffd859?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-10.x-ff4785?logo=storybook&logoColor=white)](https://storybook.js.org/)

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
| ♿ **Accessible**     | Semantic HTML, ARIA roles/labels, `data-testid` attributes, keyboard navigation on all cards        |

---

## 🛠️ Tech Stack

| Layer       | Technology                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Framework   | [Vue 3](https://vuejs.org/) with `<script setup>` + Composition API                                                    |
| Language    | TypeScript (strict mode)                                                                                               |
| Build tool  | [Vite 7](https://vite.dev/)                                                                                            |
| State       | [Pinia 3](https://pinia.vuejs.org/) — options store                                                                    |
| Routing     | [Vue Router 5](https://router.vuejs.org/) — single route `/`                                                           |
| Styling     | [Tailwind CSS 3](https://tailwindcss.com/) + [`@tailwindcss/forms`](https://github.com/tailwindlabs/tailwindcss-forms) |
| Testing     | [Storybook 10](https://storybook.js.org/) — CSF3 stories + `play` interaction tests                                    |
| Dev tooling | [Vue DevTools](https://devtools.vuejs.org/) (Vite plugin, skipped in Storybook), Prettier                              |

---

## 📁 Project Structure

```
src/
├── api/
│   └── http.js                    # Thin fetch wrapper (GET / POST / PATCH / DELETE)
├── components/
│   ├── ConfirmDialog.vue          # Reusable "are you sure?" modal
│   ├── ConfirmDialog.stories.ts   # Stories: Open, Closed
│   ├── TaskCard.vue               # Individual task card (click-to-edit, drag, status, delete)
│   ├── TaskCard.stories.ts        # Stories: Todo, InProgress, Interactions
│   ├── TaskForm.vue               # Dual-mode form — create or edit a task
│   ├── TaskForm.stories.ts        # Stories: CreateMode, ValidationStates, EditMode
│   ├── TaskList.vue               # Renders a list of TaskCards and bubbles events up
│   └── TaskList.stories.ts        # Stories: Default, BubblingEvents
├── router/
│   └── index.js                   # Single route: / → TasksView
├── stores/
│   └── task.store.js              # Pinia store — all task CRUD actions
├── stories/
│   └── taskFixtures.ts            # Shared story fixtures and helpers
├── types/
│   └── task.ts                    # Task & TaskStatus TypeScript interfaces
├── utils/
│   └── date.ts                    # formatDueDate() — human-readable date formatter
├── views/
│   ├── TasksView.vue              # Main view — orchestrates all components and state
│   └── TasksView.stories.ts       # Stories: HappyPath, DragAndDropStatusUpdate, LoadError
├── App.vue                        # Root component (router-view)
├── App.stories.ts                 # App shell story with memory router
├── index.css                      # Tailwind base/components/utilities directives
└── main.js                        # App entry point
```

```
.storybook/
├── main.js           # Storybook config — stories glob, addons, framework
├── preview.js        # Global decorators, parameters, imports index.css
└── vitest.setup.js   # Vitest setup file for Storybook addon-vitest
```

---

## ⚙️ Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0`
- **npm** (bundled with Node)
- A running **backend API** at `http://localhost:4000` (or configure `VITE_API_BASE` — see below)

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

This project uses **CSF3 stories with `play` functions** as the primary interaction-testing workflow. Stories are written in TypeScript and cover all components, views, props, emits, and user flows end-to-end.

### Storybook addons

| Addon                      | Purpose                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| `@storybook/addon-vitest`  | Runs story `play` functions as Vitest tests; surfaces pass/fail state |
| `@storybook/addon-a11y`    | Automated accessibility audits (WCAG AA) on every story               |
| `@storybook/addon-docs`    | Auto-generates component docs from props and JSDoc comments           |
| `@chromatic-com/storybook` | Chromatic visual regression testing integration                       |

### 1) Start Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006).

### 2) Run interaction tests from the Storybook UI

For each story:

- Open the story in the left sidebar
- View the **Interactions** panel to see each play step pass or fail in real time
- Check the **A11y** panel for accessibility violations
- Use the **Tests** panel (addon-vitest) to see an overall pass/fail summary

### 3) What is tested

| Story file                 | Stories                                             | What is verified                                                                      |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `TaskForm.stories.ts`      | `CreateMode`, `ValidationStates`, `EditMode`        | form submission payload, validation error, cancel emit, pre-fill from `initialValues` |
| `TaskCard.stories.ts`      | `Todo`, `InProgress`, `Interactions`                | status badge, click-to-open, status change, delete, event isolation                   |
| `TaskList.stories.ts`      | `Default`, `BubblingEvents`                         | renders all cards, all 3 events bubble correctly to parent                            |
| `ConfirmDialog.stories.ts` | `Open`, `Closed`                                    | dialog ARIA attributes, cancel/confirm emits, hidden when `open=false`                |
| `TasksView.stories.ts`     | `HappyPath`, `DragAndDropStatusUpdate`, `LoadError` | create→edit→delete flow, drag-drop status update, API error state                     |
| `App.stories.ts`           | `Default`                                           | app shell renders with memory router                                                  |

### Mocking strategy

- **API**: `http.get/post/patch/del` are mutable properties on the exported `http` object — stories overwrite them with `fn().mockImplementation(...)` to simulate the backend without a real server.
- **Store**: a fresh Pinia instance is created per story via `createPinia()` + `setActivePinia()` and reset with `store.$reset()`.
- **Spies**: all event handlers use `fn().mockReturnValue(undefined)` so play tests can assert `toHaveBeenCalledWith(...)` and `.mock.calls`.

### 4) Build Storybook

```bash
npm run build-storybook
```

Produces a static Storybook in `storybook-static/` — useful for CI or hosting as a component catalogue.

---

## 🗺️ Architecture & Data Flow

```
TasksView (orchestrator)
│
├── TaskForm                 ← create mode  (@submit → store.createTask)
│
├── section: All Created Tasks
│   └── TaskList             ← sorted by dueAt, scrollable
│       └── TaskCard[]       ← @open, @status, @delete
│
├── section: Board by status
│   ├── column: To do
│   │   └── TaskList (draggable wrappers)
│   ├── column: In progress
│   │   └── TaskList (draggable wrappers)
│   └── column: Done
│       └── TaskList (draggable wrappers)
│
├── TaskForm (modal)         ← edit mode, pre-filled  (@submit → store.updateTask)
└── ConfirmDialog            ← delete confirmation  (@confirm → store.deleteTask)
```

### State (`src/stores/task.store.js` — Pinia options store)

| Action                     | HTTP call                     | Store effect                               |
| -------------------------- | ----------------------------- | ------------------------------------------ |
| `fetchAll()`               | `GET /api/tasks`              | Replaces `items[]`; sets `loading`/`error` |
| `getTaskById(id)`          | `GET /api/tasks/:id`          | Writes to `task` (single task object)      |
| `createTask(payload)`      | `POST /api/tasks`             | Prepends created task, re-sorts by dueAt   |
| `updateTask(id, payload)`  | `PATCH /api/tasks/:id`        | Merges patch, updates matching item        |
| `updateStatus(id, status)` | `PATCH /api/tasks/:id/status` | Updates `status` of matching item          |
| `deleteTask(id)`           | `DELETE /api/tasks/:id`       | Filters item out of `items[]`              |

### API helper (`src/api/http.js`)

A minimal `fetch` wrapper that:

- Prefixes every request with `VITE_API_BASE` (default `http://localhost:4000`)
- Always sends `Content-Type: application/json`
- Throws a descriptive `Error` on non-`2xx` responses (using `body.message` if available)
- Returns `undefined` on `204 No Content`
- Exposes `http.get`, `http.post`, `http.patch`, `http.del` as **direct mutable properties**, enabling story-level monkey-patching without module mocking

---

## 🧩 Component Reference

### `TaskForm.vue`

A dual-mode form component reused for both creating and editing tasks.

| Prop            | Type                             | Default         | Description                                           |
| --------------- | -------------------------------- | --------------- | ----------------------------------------------------- |
| `mode`          | `'create' \| 'edit'`             | `'create'`      | Controls reset-on-submit and Cancel button visibility |
| `heading`       | `string`                         | `'Create task'` | Form card heading                                     |
| `submitLabel`   | `string`                         | `'Add task'`    | Submit button label                                   |
| `initialValues` | `{ title, description?, dueAt }` | —               | Pre-fills fields in edit mode                         |

**Emits:** `@submit(payload: { title, description?, dueAt })`, `@cancel`

**Validation:** title must be ≥ 2 characters; due date is required. Errors render in a `role="alert"` paragraph.

**Key `data-testid` attributes:** `task-form`, `form-error`, `form-submit-btn`, `form-cancel-btn`

---

### `TaskCard.vue`

Interactive card for a single task.

| Interaction              | Behaviour                                                 |
| ------------------------ | --------------------------------------------------------- |
| Click / Enter / Space    | Emits `@open(task)` — opens the edit modal                |
| Status `<select>` change | Emits `@status({ id, status })` — stops event propagation |
| Trash button click       | Emits `@delete(id)` — stops event propagation             |

Status badge colours: `todo` → slate · `in_progress` → amber · `done` → emerald

**Key `data-testid` attributes:** `task-card-{id}`, `task-status-badge`, `task-due-date`, `task-status-select`

**ARIA:** `role="button"`, `aria-label="Task: {title}"` on card; `aria-label="Delete task"` on trash button; `aria-label="Status for {title}"` on select

---

### `TaskList.vue`

Thin wrapper that renders a list of `TaskCard`s and bubbles all events (`@status`, `@delete`, `@open`) up to the parent unchanged.

**`data-testid`:** `task-list`

---

### `ConfirmDialog.vue`

A blocking confirmation modal for destructive actions.

| Prop      | Type      | Description         |
| --------- | --------- | ------------------- |
| `open`    | `boolean` | Controls visibility |
| `title`   | `string`  | Dialog heading      |
| `message` | `string`  | Body text           |

**Emits:** `@confirm`, `@cancel`

**ARIA:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby="confirm-dialog-title"`, `aria-describedby="confirm-dialog-message"`

**Key `data-testid` attributes:** `confirm-dialog`, `confirm-dialog-backdrop`, `dialog-cancel-btn`, `dialog-confirm-btn`

---

## 🔧 Utilities

### `src/utils/date.ts` — `formatDueDate(value: string): string`

Converts an ISO 8601 date string into a human-readable locale-aware string using `Intl.DateTimeFormat`.

**Output format:** `Mon, 20 Mar 2026, 09:30 AM` _(locale-sensitive)_

Returns `"Invalid due date"` for unparseable input values.

Used in `TaskCard.vue` to display the `dueAt` field on each task card.

---

## 📖 Story Fixtures (`src/stories/taskFixtures.ts`)

Shared helpers used across all story files to keep test data consistent and avoid repetition.

| Export                        | Description                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `createStoryTask(overrides?)` | Returns a single `Task` with sensible defaults             |
| `storyTasks`                  | Array of 3 tasks — `todo`, `in_progress`, `done`           |
| `cloneTask(task)`             | Shallow-copies a single task (prevents mutation)           |
| `cloneTasks(tasks?)`          | Deep-copies the full task array (defaults to `storyTasks`) |
| `statusLabel(status)`         | Maps `TaskStatus` → human label (`"To do"` etc.)           |

---

## 🌗 Dark Mode

Dark mode is implemented using Tailwind's `class` strategy:

- The `dark` class is toggled on `<html>` via the animated sun→moon pill switch in the header.
- The preference is persisted to `localStorage` under the key `theme`.
- On page load, `localStorage` is read first; if no value is saved it falls back to the OS-level `prefers-color-scheme` media query.
- All components carry full `dark:` Tailwind variants for backgrounds, borders, text, and rings.

---

## 🤝 IDE Setup

| Tool       | Recommendation                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Editor     | [VS Code](https://code.visualstudio.com/)                                                                                              |
| Vue plugin | [Vue — Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur if installed)                           |
| Browser    | Chrome/Edge/Brave + [Vue DevTools extension](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) |

---

<div align="center">

Made with ❤️ using Vue 3 + Vite + Storybook

</div>
