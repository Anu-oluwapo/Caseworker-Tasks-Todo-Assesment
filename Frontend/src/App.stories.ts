import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'

const MockRouteComponent = {
  template: `
    <section class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
      <h2 class="text-lg font-semibold text-slate-900">Mocked router view</h2>
      <p data-testid="mock-router-content" class="mt-2">Storybook is rendering the current route through a memory router.</p>
    </section>
  `,
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'storybook-home', component: MockRouteComponent }],
})

setup((app) => {
  app.use(router)
})

const meta = {
  title: 'App/AppShell',
  component: App,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  loaders: [
    async () => {
      await router.push('/')
      await router.isReady()
      return {}
    },
  ],
  render: () => ({
    components: { App },
    template: '<App />',
  }),
} satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('mock-router-content')).toBeInTheDocument()
  },
}
