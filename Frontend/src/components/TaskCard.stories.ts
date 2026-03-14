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

      function handleDelete(task: Task) {
        args.onDelete!(task)
        deleteTaskId.value = task._id
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

export const Done: Story = {
  args: {
    task: createStoryTask({
      _id: 'task-done',
      status: 'done',
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

    // Status change
    const statusSelect = canvas.getByTestId('task-status-select')
    await userEvent.selectOptions(statusSelect, 'done')
    await waitFor(() => {
      expect(args.onStatus).toHaveBeenCalledWith({ id: 'task-interactions', status: 'done' })
    })

    // Delete button
    await userEvent.click(canvas.getByRole('button', { name: 'Delete task' }))
    expect(args.onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'task-interactions' }),
    )

    // Card click opens task
    await userEvent.click(canvas.getByText('Update hearing notes'))
    await waitFor(() => {
      expect(args.onOpen).toHaveBeenCalledWith(
        expect.objectContaining({ _id: 'task-interactions' }),
      )
    })
  },
}
