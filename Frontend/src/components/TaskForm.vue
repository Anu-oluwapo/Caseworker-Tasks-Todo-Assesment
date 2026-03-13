<script setup lang="ts">
import { ref, watch } from 'vue'

type TaskFormValues = {
  title: string
  description?: string
  dueAt: string
}

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    heading?: string
    submitLabel?: string
    initialValues?: TaskFormValues
  }>(),
  {
    mode: 'create',
    heading: 'Create task',
    submitLabel: 'Add task',
  },
)

const emit = defineEmits<{
  (e: 'submit', payload: TaskFormValues): void
  (e: 'cancel'): void
}>()

const title = ref('')
const description = ref('')
const dueAt = ref('')

const error = ref('')

function toDateTimeLocalValue(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

watch(
  () => props.initialValues,
  (value) => {
    if (!value) {
      if (props.mode === 'create') {
        title.value = ''
        description.value = ''
        dueAt.value = ''
      }
      return
    }

    title.value = value.title ?? ''
    description.value = value.description ?? ''
    dueAt.value = toDateTimeLocalValue(value.dueAt)
    error.value = ''
  },
  { immediate: true },
)

function onSubmit() {
  error.value = ''

  if (title.value.trim().length < 2) {
    error.value = 'Title must be at least 2 characters.'
    return
  }
  if (!dueAt.value) {
    error.value = 'Due date/time is required.'
    return
  }

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim() ? description.value.trim() : undefined,
    dueAt: new Date(dueAt.value).toISOString(),
  })

  if (props.mode === 'create') {
    title.value = ''
    description.value = ''
    dueAt.value = ''
  }
}
</script>

<template>
  <form
    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{{ heading }}</h2>

    <p
      v-if="error"
      class="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
    >
      {{ error }}
    </p>

    <div class="mt-4 grid gap-4">
      <div>
        <label for="task-title" class="text-sm font-medium text-slate-700">Title</label>
        <input
          id="task-title"
          v-model="title"
          class="mt-1.5 block w-full rounded-xl border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g. Review new claim"
        />
      </div>

      <div>
        <label for="task-description" class="text-sm font-medium text-slate-700"
          >Description (optional)</label
        >
        <textarea
          id="task-description"
          v-model="description"
          class="mt-1.5 block w-full rounded-xl border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
          placeholder="Extra context..."
        />
      </div>

      <div>
        <label for="task-due-date" class="text-sm font-medium text-slate-700">Due date/time</label>
        <input
          id="task-due-date"
          v-model="dueAt"
          type="datetime-local"
          class="mt-1.5 block w-full rounded-xl border-slate-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="mode === 'edit'"
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          @click="emit('cancel')"
        >
          Cancel
        </button>

        <button
          class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          {{ submitLabel }}
        </button>
      </div>
    </div>
  </form>
</template>
