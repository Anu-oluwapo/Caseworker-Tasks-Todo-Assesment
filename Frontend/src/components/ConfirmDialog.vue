<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
    data-testid="confirm-dialog-backdrop"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      data-testid="confirm-dialog"
      class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:p-6"
    >
      <h3
        id="confirm-dialog-title"
        class="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
      >
        {{ title }}
      </h3>
      <p
        id="confirm-dialog-message"
        class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400"
      >
        {{ message }}
      </p>
      <div class="mt-5 flex justify-end gap-2">
        <button
          aria-label="Cancel and close dialog"
          data-testid="dialog-cancel-btn"
          class="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          aria-label="Confirm action"
          data-testid="dialog-confirm-btn"
          class="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
          @click="emit('confirm')"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
