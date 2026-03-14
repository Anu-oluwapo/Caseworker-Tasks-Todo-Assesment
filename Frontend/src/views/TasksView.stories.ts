import { createPinia, setActivePinia } from 'pinia'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'
import { http } from '../api/http'
import { useTasksStore } from '../stores/task.store'
import type { Task, TaskStatus } from '../types/task'
import { cloneTasks } from '../stories/taskFixtures'
import TasksView from './TasksView.vue'

function createMockApi(initialTasks: Task[], options?: { failFetch?: boolean }) {
  let tasks = cloneTasks(initialTasks)
  let nextId = tasks.length + 1

  const getFn = fn().mockImplementation(async (path: string) => {
    if (path === '/api/tasks') {
      if (options?.failFetch) throw new Error('Failed to fetch tasks')
      return cloneTasks(tasks)
    }
    if (path.startsWith('/api/tasks/')) {
      const id = path.split('/').pop()
      const task = tasks.find((e) => e._id === id)
      if (!task) throw new Error('Task not found')
      return { ...task }
    }
    throw new Error(`Unhandled GET ${path}`)
  })

  const postFn = fn().mockImplementation(
    async (path: string, payload: { title: string; description?: string; dueAt: string }) => {
      if (path !== '/api/tasks') throw new Error(`Unhandled POST ${path}`)
      const now = new Date().toISOString()
      const created: Task = {
        _id: `task-${nextId++}`,
        title: payload.title,
        description: payload.description,
        dueAt: payload.dueAt,
        status: 'todo',
        createdAt: now,
        updatedAt: now,
      }
      tasks = [created, ...tasks]
      return { ...created }
    },
  )

  const patchFn = fn().mockImplementation(
    async (path: string, payload: Partial<Task> & { status?: TaskStatus }) => {
      const match = path.match(/^\/api\/tasks\/([^/]+)(?:\/(status))?$/)
      if (!match) throw new Error(`Unhandled PATCH ${path}`)

      const taskId = match[1]
      const maybeAction = match[2]
      const idx = tasks.findIndex((e) => e._id === taskId)
      if (idx === -1) throw new Error('Task not found')

      const current = tasks[idx]
      const updated: Task = {
        ...current,
        ...(maybeAction === 'status' ? { status: payload.status ?? current.status } : payload),
        updatedAt: new Date().toISOString(),
      }
      tasks.splice(idx, 1, updated)
      return { ...updated }
    },
  )

  const delFn = fn().mockImplementation(async (path: string) => {
    const id = path.split('/').pop()
    tasks = tasks.filter((e) => e._id !== id)
  })

  http.get = getFn
  http.post = postFn
  http.patch = patchFn
  http.del = delFn

  return { getFn, postFn, patchFn, delFn }
}

function renderTasksView(options?: { failFetch?: boolean; initialTasks?: Task[] }) {
  const initialTasks = options?.initialTasks ?? cloneTasks()

  return () => ({
    components: { TasksView },
    setup() {
      document.documentElement.classList.remove('dark')
      window.localStorage.removeItem('theme')

      const pinia = createPinia()
      setActivePinia(pinia)
      const store = useTasksStore()
      store.$reset()
      createMockApi(initialTasks, options)

      return {}
    },
    template: '<TasksView />',
  })
}

const meta = {
  title: 'Views/TasksView',
  component: TasksView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TasksView>

export default meta

type Story = StoryObj<typeof meta>

export const EndToEnd: Story = {
  render: renderTasksView(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const createHeading = await canvas.findByRole('heading', { name: 'Create task' })
    const createForm = createHeading.closest('form') as HTMLFormElement
    const tasksHeading = canvas.getByRole('heading', { name: 'All Created Tasks' })
    const tasksSection = tasksHeading.closest('section') as HTMLElement

    const form = within(createForm)
    await userEvent.type(form.getByLabelText('Title'), 'Follow up with claimant')
    await userEvent.type(
      form.getByLabelText('Description (optional)'),
      'Confirm the revised hearing time.',
    )
    await userEvent.type(form.getByLabelText('Due date/time'), '2026-03-24T10:30')
    await userEvent.click(form.getByRole('button', { name: 'Add task' }))

    await waitFor(() => {
      expect(within(tasksSection).getByText('Follow up with claimant')).toBeInTheDocument()
    })

    await userEvent.click(within(tasksSection).getByText('Follow up with claimant'))
    const editHeading = await canvas.findByRole('heading', { name: 'Edit task' })
    const editForm = editHeading.closest('form') as HTMLFormElement
    const modalTitleInput = within(editForm).getByLabelText('Task title')
    await userEvent.clear(modalTitleInput)
    await userEvent.type(modalTitleInput, 'Follow up urgently')
    await userEvent.click(within(editForm).getByRole('button', { name: 'Save changes' }))
    await waitFor(() => {
      expect(within(tasksSection).getByText('Follow up urgently')).toBeInTheDocument()
    })

    await userEvent.click(canvas.getByRole('switch', { name: 'Toggle dark mode' }))
    await waitFor(() => {
      expect(canvasElement.ownerDocument.documentElement.classList.contains('dark')).toBe(false)
    })

    const updatedTaskArticle = within(tasksSection)
      .getByText('Follow up urgently')
      .closest('article') as HTMLElement
    await userEvent.click(within(updatedTaskArticle).getByRole('button', { name: 'Delete task' }))
    await userEvent.click(await canvas.findByLabelText('Confirm action'))

    await waitFor(() => {
      expect(within(tasksSection).queryByText('Follow up urgently')).not.toBeInTheDocument()
    })
  },
}

export const DragAndDropStatusUpdate: Story = {
  render: renderTasksView(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tasksHeading = await canvas.findByRole('heading', { name: 'All Created Tasks' })
    const tasksSection = tasksHeading.closest('section') as HTMLElement

    const todoTaskTitle = within(tasksSection).getByText('Review eligibility evidence')
    const todoTaskArticle = todoTaskTitle.closest('article') as HTMLElement
    await expect(within(todoTaskArticle).getByTestId('task-status-badge')).toHaveTextContent(
      'To do',
    )

    const draggableCard = canvas
      .getAllByText('Review eligibility evidence')[1]
      .closest('[draggable="true"]') as HTMLElement
    const doneColumn = canvas
      .getByRole('heading', { name: 'Done' })
      .closest('section') as HTMLElement

    await fireEvent.dragStart(draggableCard)
    await fireEvent.dragOver(doneColumn)
    await fireEvent.drop(doneColumn)
    await fireEvent.dragEnd(draggableCard)

    await waitFor(() => {
      expect(within(todoTaskArticle).getByTestId('task-status-badge')).toHaveTextContent('Done')
    })
  },
}

export const LoadError: Story = {
  render: renderTasksView({ failFetch: true }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.findByText('Failed to fetch tasks')).resolves.toBeInTheDocument()
  },
}
