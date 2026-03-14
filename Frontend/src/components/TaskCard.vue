<script setup lang="ts">
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  (e: 'status', value: { id: string; status: TaskStatus }): void
  (e: 'delete', id: string): void
  (e: 'open', task: Task): void
}>()

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

function statusBadgeClass(status: TaskStatus) {
  if (status === 'done') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-400/20'
  }
  if (status === 'in_progress') {
    return 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-400/20'
  }
  return 'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-500/20'
}

function dueLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}
</script>

<template>
  <article
    class="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-5"
    role="button"
    tabindex="0"
    @click="emit('open', props.task)"
    @keydown.enter="emit('open', props.task)"
    @keydown.space.prevent="emit('open', props.task)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3
          class="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg"
        >
          {{ props.task.title }}
        </h3>
        <span
          class="mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
          :class="statusBadgeClass(props.task.status)"
        >
          {{ statusOptions.find((o) => o.value === props.task.status)?.label ?? props.task.status }}
        </span>
        <p
          v-if="props.task.description"
          class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400"
        >
          {{ props.task.description }}
        </p>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Due: <span class="font-medium">{{ dueLabel(props.task.dueAt) }}</span>
        </p>
      </div>

      <button
        class="shrink-0 rounded-xl border border-red-200 p-2 text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:border-red-800/60 dark:text-red-400 dark:hover:bg-red-900/20"
        @click.stop="emit('delete', props.task._id)"
        aria-label="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2 sm:gap-3" @click.stop>
      <label
        class="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
        >Status</label
      >
      <select
        class="block w-full rounded-xl border-slate-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 sm:w-48"
        :value="props.task.status"
        @click.stop
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
