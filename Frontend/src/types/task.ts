export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  dueAt: string // ISO
  createdAt: string
  updatedAt: string
}
