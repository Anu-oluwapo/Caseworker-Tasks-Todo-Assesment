import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import ConfirmDialog from './ConfirmDialog.vue'

const onConfirm = fn().mockReturnValue(undefined)
const onCancel = fn().mockReturnValue(undefined)

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onConfirm,
    onCancel,
  },
  render: (args) => ({
    components: { ConfirmDialog },
    setup() {
      const confirmCount = ref(0)
      const cancelCount = ref(0)

      function handleConfirm() {
        args.onConfirm!()
        confirmCount.value += 1
      }

      function handleCancel() {
        args.onCancel!()
        cancelCount.value += 1
      }

      return {
        args,
        cancelCount,
        confirmCount,
        handleCancel,
        handleConfirm,
      }
    },
    template: `
      <div class="min-h-[40vh] p-6">
        <ConfirmDialog v-bind="args" @confirm="handleConfirm" @cancel="handleCancel" />
        <div class="mt-4 space-y-2 rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-600">
          <p data-testid="confirm-count">{{ confirmCount }}</p>
          <p data-testid="cancel-count">{{ cancelCount }}</p>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    title: 'Delete task?',
    message: 'This cannot be undone.',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Dialog renders with correct role and ARIA attributes
    const dialog = canvas.getByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    // Cancel emits @cancel
    await userEvent.click(canvas.getByTestId('dialog-cancel-btn'))
    await expect(canvas.getByTestId('cancel-count')).toHaveTextContent('1')
    expect(args.onCancel).toHaveBeenCalledOnce()

    // Confirm emits @confirm
    await userEvent.click(canvas.getByTestId('dialog-confirm-btn'))
    await waitFor(() => {
      expect(canvas.getByTestId('confirm-count')).toHaveTextContent('1')
      expect(args.onConfirm).toHaveBeenCalledOnce()
    })
  },
}

export const Closed: Story = {
  args: {
    open: false,
    title: 'Delete task?',
    message: 'This cannot be undone.',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // Dialog is not in the DOM when open=false
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(canvas.queryByTestId('dialog-confirm-btn')).not.toBeInTheDocument()
    expect(args.onConfirm).not.toHaveBeenCalled()
    expect(args.onCancel).not.toHaveBeenCalled()
    await expect(canvas.getByTestId('confirm-count')).toHaveTextContent('0')
    await expect(canvas.getByTestId('cancel-count')).toHaveTextContent('0')
  },
}
