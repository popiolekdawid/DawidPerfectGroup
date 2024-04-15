import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/confirmation')({
  component: () => <div>Hello /_auth/confirmation!</div>
})