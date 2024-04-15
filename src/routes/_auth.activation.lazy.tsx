import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/activation')({
  component: () => <div>Hello /_auth/activation!</div>
})