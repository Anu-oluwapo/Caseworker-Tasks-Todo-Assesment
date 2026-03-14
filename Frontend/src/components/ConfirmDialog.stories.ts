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
      return {
        args,
      }
    },
    template: `
      <div class="min-h-[40vh] p-6">
        <ConfirmDialog v-bind="args" @confirm="args.onConfirm" @cancel="args.onCancel" />
      </div>
    `,
  }),
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    title: 'Delete task ({Task}) ?',

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
    expect(args.onCancel).toHaveBeenCalledOnce()

    // Confirm emits @confirm
    await userEvent.click(canvas.getByTestId('dialog-confirm-btn'))
    await waitFor(() => {
      expect(args.onConfirm).toHaveBeenCalledOnce()
    })
  },
}

export const Closed: Story = {
  args: {
    open: false,
    title: 'Delete task ({{Task}}) ?',
    message: 'This cannot be undone.',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // Dialog is not in the DOM when open=false
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(canvas.queryByTestId('dialog-confirm-btn')).not.toBeInTheDocument()
    expect(args.onConfirm).not.toHaveBeenCalled()
    expect(args.onCancel).not.toHaveBeenCalled()
  },
}
