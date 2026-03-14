<script setup lang="ts">
import type { Task, TaskStatus } from '../types/task'
import TaskCard from './TaskCard.vue'

defineProps<{ tasks: Task[] }>()

const emit = defineEmits<{
  (e: 'status', value: { id: string; status: TaskStatus }): void
  (e: 'delete', task: Task): void
  (e: 'open', task: Task): void
}>()
</script>

<template>
  <div class="space-y-3" data-testid="task-list">
    <TaskCard
      v-for="t in tasks"
      :key="t._id"
      :task="t"
      @status="emit('status', $event)"
      @delete="emit('delete', $event)"
      @open="emit('open', $event)"
    />
  </div>
</template>
