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

const statusSections: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

onMounted(() => store.fetchAll())

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
  <main class="min-h-screen bg-slate-50 py-8 sm:py-10">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <header
        class="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:mb-8 sm:p-6"
      >
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Caseworker Tasks
        </h1>
        <p class="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Create and track tasks efficiently.
        </p>
      </header>

      <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-6">
        <TaskForm @submit="handleCreate" />

        <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Tasks</h2>
            <button
              class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              @click="store.fetchAll"
              :disabled="store.loading"
            >
              Refresh
            </button>
          </div>

          <p
            v-if="store.error"
            class="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {{ store.error }}
          </p>
          <p
            v-else-if="store.loading"
            class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          >
            Loading…
          </p>
          <p
            v-else-if="sorted.length === 0"
            class="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-600"
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
        class="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-5"
      >
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Board by status
          </h2>
          <p class="text-xs text-slate-500 sm:text-sm">
            Drag tasks between columns to update status.
          </p>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-3">
          <section
            v-for="section in statusSections"
            :key="section.key"
            class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4"
            :class="
              draggingOverStatus === section.key ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
            "
            @dragover.prevent="onDragOver(section.key)"
            @dragleave="draggingOverStatus = null"
            @drop.prevent="onDrop(section.key)"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {{ section.label }}
              </h3>
              <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
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
              class="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500"
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
