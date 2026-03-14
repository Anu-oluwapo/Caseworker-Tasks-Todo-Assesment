import type { Task, TaskStatus } from '../types/task'

const baseDate = '2026-03-20T09:30:00.000Z'

export function createStoryTask(overrides: Partial<Task> = {}): Task {
  return {
    _id: overrides._id ?? 'task-1',
    title: overrides.title ?? 'Review eligibility evidence',
    description:
      overrides.description ?? 'Check uploaded documents before the afternoon review call.',
    status: overrides.status ?? 'todo',
    dueAt: overrides.dueAt ?? baseDate,
    createdAt: overrides.createdAt ?? '2026-03-14T08:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-03-14T08:00:00.000Z',
  }
}

export const storyTasks: Task[] = [
  createStoryTask(),
  createStoryTask({
    _id: 'task-2',
    title: 'Call claimant',
    description: 'Confirm the outstanding address details for the case file.',
    status: 'in_progress',
    dueAt: '2026-03-20T11:00:00.000Z',
    createdAt: '2026-03-14T08:30:00.000Z',
    updatedAt: '2026-03-14T08:45:00.000Z',
  }),
  createStoryTask({
    _id: 'task-3',
    title: 'Send approval summary',
    description: 'Share the approved case summary with the regional team.',
    status: 'done',
    dueAt: '2026-03-20T14:30:00.000Z',
    createdAt: '2026-03-14T09:00:00.000Z',
    updatedAt: '2026-03-14T09:30:00.000Z',
  }),
]

export function cloneTask(task: Task): Task {
  return { ...task }
}

export function cloneTasks(tasks: Task[] = storyTasks): Task[] {
  return tasks.map((task) => cloneTask(task))
}

export function statusLabel(status: TaskStatus) {
  if (status === 'in_progress') return 'In progress'
  if (status === 'done') return 'Done'
  return 'To do'
}
