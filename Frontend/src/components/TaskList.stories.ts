import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import TaskList from './TaskList.vue'
import { cloneTasks } from '../stories/taskFixtures'

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
      return {
        args,
      }
    },
    template: `
      <div class="w-[30rem] max-w-full p-4">
        <TaskList v-bind="args" @open="args.onOpen" @delete="args.onDelete" @status="args.onStatus" />
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

export const EmittedEvents: Story = {
  args: {
    tasks: cloneTasks(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('task-list')).toBeInTheDocument()

    // Card click bubbles @open with correct task
    await userEvent.click(canvas.getByText('Call claimant'))
    await waitFor(() => {
      expect(args.onOpen).toHaveBeenCalledWith(expect.objectContaining({ _id: 'task-2' }))
    })

    // Status change bubbles @status with correct payload
    const statusSelects = canvas.getAllByTestId('task-status-select')
    await userEvent.selectOptions(statusSelects[0], 'done')
    await waitFor(() => {
      expect(args.onStatus).toHaveBeenCalledWith({ id: 'task-1', status: 'done' })
    })

    // Delete button bubbles @delete with correct id
    const deleteButtons = canvas.getAllByRole('button', { name: 'Delete task' })
    await userEvent.click(deleteButtons[2])
    await waitFor(() => {
      expect(args.onDelete).toHaveBeenCalledWith({
        _id: 'task-3',
        title: 'Send approval summary',
        description: 'Share the approved case summary with the regional team.',
        status: 'done',
        dueAt: '2026-03-20T14:30:00.000Z',
        createdAt: '2026-03-14T09:00:00.000Z',
        updatedAt: '2026-03-14T09:30:00.000Z',
      })
    })
  },
}
