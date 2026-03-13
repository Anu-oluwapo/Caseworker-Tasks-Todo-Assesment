<script setup lang="ts">
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  (e: 'status', value: { id: string; status: TaskStatus }): void
  (e: 'delete', id: string): void
}>()

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

function statusBadgeClass(status: TaskStatus) {
  if (status === 'done') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
  }
  if (status === 'in_progress') {
    return 'bg-amber-50 text-amber-700 ring-amber-600/20'
  }
  return 'bg-slate-100 text-slate-700 ring-slate-600/20'
}

function dueLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}
</script>

<template>
  <article
    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          {{ props.task.title }}
        </h3>
        <span
          class="mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
          :class="statusBadgeClass(props.task.status)"
        >
          {{ statusOptions.find((o) => o.value === props.task.status)?.label ?? props.task.status }}
        </span>
        <p v-if="props.task.description" class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {{ props.task.description }}
        </p>
        <p class="mt-3 text-xs text-slate-500">
          Due: <span class="font-medium">{{ dueLabel(props.task.dueAt) }}</span>
        </p>
      </div>

      <button
        class="shrink-0 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
        @click="emit('delete', props.task._id)"
        aria-label="Delete task"
      >
        Delete
      </button>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-600">Status</label>
      <select
        class="block w-full rounded-xl border-slate-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-48"
        :value="props.task.status"
        @change="
          emit('status', {
            id: props.task._id,
            status: ($event.target as HTMLSelectElement).value as TaskStatus,
          })
        "
      >
        <option v-for="o in statusOptions" :key="o.value" :value="o.value">
          {{ o.label }}
        </option>
      </select>
    </div>
  </article>
</template>
