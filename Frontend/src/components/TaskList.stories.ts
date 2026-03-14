import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import TaskList from './TaskList.vue'
import { cloneTasks } from '../stories/taskFixtures'
import type { Task, TaskStatus } from '../types/task'

const onOpen = fn().mockReturnValue(undefined)
const onDelete = fn().mockReturnValue(undefined)
const onStatus = fn().mockReturnValue(undefined)

const meta = {
  title: 'Components/TaskList',
  component: TaskList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onOpen,
    onDelete,
    onStatus,
  },
  render: (args) => ({
    components: { TaskList },
    setup() {
      const openTaskId = ref('none')
      const deleteTaskId = ref('none')
      const statusPayload = ref('none')
      const renderCount = computed(() => String(args.tasks.length))

      function handleOpen(task: Task) {
        args.onOpen!(task)
        openTaskId.value = task._id
      }

      function handleDelete(id: string) {
        args.onDelete!(id)
        deleteTaskId.value = id
      }

      function handleStatus(payload: { id: string; status: TaskStatus }) {
        args.onStatus!(payload)
        statusPayload.value = JSON.stringify(payload)
      }

      return {
        args,
        deleteTaskId,
        handleDelete,
        handleOpen,
        handleStatus,
        openTaskId,
        renderCount,
        statusPayload,
      }
    },
    template: `
      <div class="w-[30rem] max-w-full p-4">
        <TaskList v-bind="args" @open="handleOpen" @delete="handleDelete" @status="handleStatus" />
        <div class="mt-4 space-y-2 rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-600">
          <p data-testid="render-count">{{ renderCount }}</p>
          <p data-testid="open-id">{{ openTaskId }}</p>
          <p data-testid="delete-id">{{ deleteTaskId }}</p>
          <pre data-testid="status-payload" class="whitespace-pre-wrap break-words">{{ statusPayload }}</pre>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof TaskList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tasks: cloneTasks(),
  },
}

export const BubblingEvents: Story = {
  args: {
    tasks: cloneTasks(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('render-count')).toHaveTextContent('3')
    await expect(canvas.getByTestId('task-list')).toBeInTheDocument()

    // Card click bubbles @open with correct task
    await userEvent.click(canvas.getByText('Call claimant'))
    await waitFor(() => {
      expect(canvas.getByTestId('open-id')).toHaveTextContent('task-2')
      expect(args.onOpen).toHaveBeenCalledWith(expect.objectContaining({ _id: 'task-2' }))
    })

    // Status change bubbles @status with correct payload
    const statusSelects = canvas.getAllByTestId('task-status-select')
    await userEvent.selectOptions(statusSelects[0], 'done')
    await waitFor(() => {
      expect(canvas.getByTestId('status-payload')).toHaveTextContent('task-1')
      expect(canvas.getByTestId('status-payload')).toHaveTextContent('done')
      expect(args.onStatus).toHaveBeenCalledWith({ id: 'task-1', status: 'done' })
    })

    // Delete button bubbles @delete with correct id
    const deleteButtons = canvas.getAllByRole('button', { name: 'Delete task' })
    await userEvent.click(deleteButtons[2])
    await waitFor(() => {
      expect(canvas.getByTestId('delete-id')).toHaveTextContent('task-3')
      expect(args.onDelete).toHaveBeenCalledWith('task-3')
    })
  },
}
