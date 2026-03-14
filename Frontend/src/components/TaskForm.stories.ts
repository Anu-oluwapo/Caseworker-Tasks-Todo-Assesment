import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import TaskForm from './TaskForm.vue'

const onSubmit = fn().mockReturnValue(undefined)
const onCancel = fn().mockReturnValue(undefined)

const meta = {
  title: 'Components/TaskForm',
  component: TaskForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit,
    onCancel,
  },
  render: (args) => ({
    components: { TaskForm },
    setup() {
      const submitted = ref('')
      const submittedCount = ref(0)
      const cancelCount = ref(0)
      const submittedJson = computed(() => submitted.value || 'none')

      function handleSubmit(payload: { title: string; description?: string; dueAt: string }) {
        args.onSubmit!(payload)
        submitted.value = JSON.stringify(payload)
        submittedCount.value += 1
      }

      function handleCancel() {
        args.onCancel!()
        cancelCount.value += 1
      }

      return {
        args,
        cancelCount,
        handleCancel,
        handleSubmit,
        submittedCount,
        submittedJson,
      }
    },
    template: `
      <div class="w-[28rem] max-w-full p-4">
        <TaskForm v-bind="args" @submit="handleSubmit" @cancel="handleCancel" />
        <div class="mt-4 space-y-2 rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-600">
          <p data-testid="submit-count">{{ submittedCount }}</p>
          <p data-testid="cancel-count">{{ cancelCount }}</p>
          <pre data-testid="submit-payload" class="whitespace-pre-wrap break-words">{{ submittedJson }}</pre>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof TaskForm>

export default meta

type Story = StoryObj<typeof meta>

export const CreateMode: Story = {
  args: {
    mode: 'create',
    heading: 'Create task',
    submitLabel: 'Add task',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const titleInput = canvas.getByLabelText('Title')
    const descriptionInput = canvas.getByLabelText('Description (optional)')
    const dueDateInput = canvas.getByLabelText('Due date/time')

    await userEvent.type(titleInput, 'Prepare tribunal pack')
    await userEvent.type(descriptionInput, 'Include the revised witness statement.')
    await userEvent.type(dueDateInput, '2026-03-21T10:15')
    await userEvent.click(canvas.getByTestId('form-submit-btn'))

    await waitFor(() => {
      expect(canvas.getByTestId('submit-count')).toHaveTextContent('1')
      expect(args.onSubmit).toHaveBeenCalledOnce()
    })

    const [submittedPayload] = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0]
    expect(submittedPayload.title).toBe('Prepare tribunal pack')
    expect(submittedPayload.description).toBe('Include the revised witness statement.')
    expect(submittedPayload.dueAt).toBe(new Date('2026-03-21T10:15').toISOString())

    await waitFor(() => {
      expect(titleInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')
      expect(dueDateInput).toHaveValue('')
    })
  },
}

export const ValidationStates: Story = {
  args: {
    mode: 'create',
    heading: 'Create task',
    submitLabel: 'Add task',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Submit empty form — should show validation error
    await userEvent.click(canvas.getByTestId('form-submit-btn'))
    await expect(canvas.getByTestId('form-error')).toHaveTextContent(
      'Title must be at least 2 characters.',
    )

    // Type a single character title — still invalid
    const titleInput = canvas.getByLabelText('Title')
    const dueDateInput = canvas.getByLabelText('Due date/time')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'A')
    await userEvent.type(dueDateInput, '2026-03-22T08:00')
    await userEvent.click(canvas.getByTestId('form-submit-btn'))

    await expect(canvas.getByTestId('form-error')).toHaveTextContent(
      'Title must be at least 2 characters.',
    )
    expect(args.onSubmit).not.toHaveBeenCalled()
    expect(canvas.getByTestId('submit-count')).toHaveTextContent('0')
  },
}

export const EditMode: Story = {
  args: {
    mode: 'edit',
    heading: 'Edit task',
    submitLabel: 'Save changes',
    initialValues: {
      title: 'Review original case notes',
      description: 'Cross-check the notes with the uploaded documents.',
      dueAt: '2026-03-23T13:45:00.000Z',
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const titleInput = canvas.getByLabelText('Title')
    const descriptionInput = canvas.getByLabelText('Description (optional)')

    // Pre-filled values from initialValues prop
    await expect(titleInput).toHaveValue('Review original case notes')
    await expect(descriptionInput).toHaveValue('Cross-check the notes with the uploaded documents.')

    // Cancel button emits @cancel
    await userEvent.click(canvas.getByTestId('form-cancel-btn'))
    await expect(canvas.getByTestId('cancel-count')).toHaveTextContent('1')
    expect(args.onCancel).toHaveBeenCalledOnce()

    // Edit title and save
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Review amended case notes')
    await userEvent.click(canvas.getByTestId('form-submit-btn'))

    await waitFor(() => {
      expect(canvas.getByTestId('submit-count')).toHaveTextContent('1')
      expect(args.onSubmit).toHaveBeenCalledOnce()
    })

    const [submittedPayload] = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0]
    expect(submittedPayload.title).toBe('Review amended case notes')
    expect(canvas.getByTestId('submit-payload')).toHaveTextContent('Review amended case notes')
  },
}
