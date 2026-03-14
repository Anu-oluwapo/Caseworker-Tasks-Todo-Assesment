import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import TaskCard from './TaskCard.vue'
import { createStoryTask } from '../stories/taskFixtures'
import type { Task, TaskStatus } from '../types/task'

const onOpen = fn().mockReturnValue(undefined)
const onDelete = fn().mockReturnValue(undefined)
const onStatus = fn().mockReturnValue(undefined)

const meta = {
  title: 'Components/TaskCard',
  component: TaskCard,
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
    components: { TaskCard },
    setup() {
      const openCount = ref(0)
      const openTaskId = ref('none')
      const deleteTaskId = ref('none')
      const statusPayload = ref('none')
      const openSummary = computed(() => `${openCount.value}:${openTaskId.value}`)

      function handleOpen(task: Task) {
        args.onOpen!(task)
        openCount.value += 1
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
        openSummary,
        statusPayload,
      }
    },
    template: `
      <div class="w-[24rem] max-w-full p-4">
        <TaskCard v-bind="args" @open="handleOpen" @delete="handleDelete" @status="handleStatus" />
        <div class="mt-4 space-y-2 rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-600">
          <p data-testid="open-summary">{{ openSummary }}</p>
          <p data-testid="delete-id">{{ deleteTaskId }}</p>
          <pre data-testid="status-payload" class="whitespace-pre-wrap break-words">{{ statusPayload }}</pre>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof TaskCard>

export default meta

type Story = StoryObj<typeof meta>

export const Todo: Story = {
  args: {
    task: createStoryTask(),
  },
}

export const InProgress: Story = {
  args: {
    task: createStoryTask({
      _id: 'task-in-progress',
      status: 'in_progress',
      title: 'Investigate discrepancy',
    }),
  },
}

export const Interactions: Story = {
  args: {
    task: createStoryTask({ _id: 'task-interactions', title: 'Update hearing notes' }),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Status change — select does NOT bubble open
    const statusSelect = canvas.getByTestId('task-status-select')
    await userEvent.selectOptions(statusSelect, 'done')
    await waitFor(() => {
      expect(canvas.getByTestId('status-payload')).toHaveTextContent('task-interactions')
      expect(canvas.getByTestId('status-payload')).toHaveTextContent('done')
      expect(args.onStatus).toHaveBeenCalledWith({ id: 'task-interactions', status: 'done' })
    })
    expect(canvas.getByTestId('open-summary')).toHaveTextContent('0:none')

    // Delete button — does NOT bubble open
    await userEvent.click(canvas.getByRole('button', { name: 'Delete task' }))
    await expect(canvas.getByTestId('delete-id')).toHaveTextContent('task-interactions')
    expect(args.onDelete).toHaveBeenCalledWith('task-interactions')
    expect(canvas.getByTestId('open-summary')).toHaveTextContent('0:none')

    // Card click opens task
    await userEvent.click(canvas.getByText('Update hearing notes'))
    await waitFor(() => {
      expect(canvas.getByTestId('open-summary')).toHaveTextContent('1:task-interactions')
      expect(args.onOpen).toHaveBeenCalledWith(
        expect.objectContaining({ _id: 'task-interactions' }),
      )
    })
  },
}
