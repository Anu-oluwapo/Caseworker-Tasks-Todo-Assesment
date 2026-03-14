<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTasksStore } from '../stores/task.store'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import type { Task, TaskStatus } from '../types/task'

const store = useTasksStore()

const toDeleteId = ref<string | null>(null)
const editingTask = ref<Task | null>(null)
const editSaving = ref(false)
const draggingTaskId = ref<string | null>(null)
const draggingOverStatus = ref<TaskStatus | null>(null)
const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const statusSections: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

onMounted(() => {
  store.fetchAll()
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

const sorted = computed(() => [...store.items].sort((a, b) => a.dueAt.localeCompare(b.dueAt)))

const groupedByStatus = computed<Record<TaskStatus, Task[]>>(() => {
  const empty: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    done: [],
  }

  for (const task of sorted.value) {
    empty[task.status].push(task)
  }

  return empty
})

async function handleCreate(payload: { title: string; description?: string; dueAt: string }) {
  await store.createTask(payload)
}

async function handleEdit(payload: Task) {
  if (!editingTask.value) return

  try {
    editSaving.value = true
    await store.updateTask(editingTask.value._id, payload)
    editingTask.value = null
  } finally {
    editSaving.value = false
  }
}

async function handleStatusChange(payload: { id: string; status: TaskStatus }) {
  await store.updateStatus(payload.id, payload.status)
}

function onDragStart(taskId: string) {
  draggingTaskId.value = taskId
}

function onDragEnd() {
  draggingTaskId.value = null
  draggingOverStatus.value = null
}

function onDragOver(status: TaskStatus) {
  draggingOverStatus.value = status
}

async function onDrop(status: TaskStatus) {
  const taskId = draggingTaskId.value
  draggingOverStatus.value = null
  if (!taskId) return

  const task = store.items.find((t) => t._id === taskId)
  if (!task || task.status === status) {
    draggingTaskId.value = null
    return
  }

  await store.updateStatus(taskId, status)
  draggingTaskId.value = null
}

function askDelete(id: string) {
  toDeleteId.value = id
}

function openEditModal(task: Task) {
  store.getTaskById(task._id)
  editingTask.value = task
}

function closeEditModal() {
  if (editSaving.value) return
  editingTask.value = null
}

async function confirmDelete() {
  if (!toDeleteId.value) return
  await store.deleteTask(toDeleteId.value)
  toDeleteId.value = null
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 py-8 dark:bg-slate-900 sm:py-10">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <header
        class="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800 sm:mb-8 sm:p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1
              class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl"
            >
              Caseworker Tasks
            </h1>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Create and track tasks efficiently.
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2 pt-1">
            <button
              type="button"
              role="switch"
              :aria-checked="isDark"
              aria-label="Toggle dark mode"
              @click="toggleDark"
              class="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              :class="isDark ? 'bg-indigo-600' : 'bg-amber-400'"
            >
              <span
                aria-hidden="true"
                class="pointer-events-none relative inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow ring-0 transition-all duration-300 ease-in-out"
                :class="isDark ? 'translate-x-7' : 'translate-x-0'"
              >
                <!-- Sun rays (light mode) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute h-3.5 w-3.5 text-amber-500 transition-all duration-300"
                  :class="isDark ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>

                <!-- Moon (dark mode) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute h-3.5 w-3.5 text-indigo-500 transition-all duration-300"
                  :class="
                    isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'
                  "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-6">
        <TaskForm @submit="handleCreate" />

        <section
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
        >
          <div class="flex items-center justify-between gap-2">
            <h2
              class="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg"
            >
              Tasks
            </h2>
            <button
              class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              @click="store.fetchAll"
              :disabled="store.loading"
            >
              Refresh
            </button>
          </div>

          <p
            v-if="store.error"
            class="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ store.error }}
          </p>
          <p
            v-else-if="store.loading"
            class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            Loading…
          </p>
          <p
            v-else-if="sorted.length === 0"
            class="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            No tasks yet.
          </p>

          <div class="mt-4" v-if="sorted.length">
            <TaskList
              class="h-[500px] overflow-scroll"
              :tasks="sorted"
              @status="handleStatusChange"
              @delete="askDelete"
              @open="openEditModal"
            />
          </div>
        </section>
      </div>

      <section
        class="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:mt-8 sm:p-5"
      >
        <div class="flex items-center justify-between gap-2">
          <h2
            class="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg"
          >
            Board by status
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Drag tasks between columns to update status.
          </p>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-3">
          <section
            v-for="section in statusSections"
            :key="section.key"
            class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-700/30 sm:p-4"
            :class="
              draggingOverStatus === section.key ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
            "
            @dragover.prevent="onDragOver(section.key)"
            @dragleave="draggingOverStatus = null"
            @drop.prevent="onDrop(section.key)"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <h3
                class="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300"
              >
                {{ section.label }}
              </h3>
              <span
                class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-200"
              >
                {{ groupedByStatus[section.key].length }}
              </span>
            </div>

            <div v-if="groupedByStatus[section.key].length" class="space-y-3">
              <div
                v-for="task in groupedByStatus[section.key]"
                :key="task._id"
                draggable="true"
                class="cursor-grab active:cursor-grabbing"
                @dragstart="onDragStart(task._id)"
                @dragend="onDragEnd"
              >
                <TaskList
                  :tasks="[task]"
                  @status="handleStatusChange"
                  @delete="askDelete"
                  @open="openEditModal"
                />
              </div>
            </div>
            <p
              v-else
              class="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              No tasks in this section.
            </p>
          </section>
        </div>
      </section>
    </div>

    <div
      v-if="editingTask"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      @click.self="closeEditModal"
    >
      <div class="w-full max-w-2xl">
        <TaskForm
          mode="edit"
          heading="Edit task"
          submit-label="Save changes"
          :initial-values="{
            title: editingTask.title,
            description: editingTask.description,
            dueAt: editingTask.dueAt,
          }"
          @submit="handleEdit"
          @cancel="closeEditModal"
        />
      </div>
    </div>

    <ConfirmDialog
      :open="!!toDeleteId"
      title="Delete task?"
      message="This cannot be undone."
      @cancel="toDeleteId = null"
      @confirm="confirmDelete"
    />
  </main>
</template>
