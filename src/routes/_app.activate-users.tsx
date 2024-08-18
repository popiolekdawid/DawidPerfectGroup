import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/activate-users')({
  component: () => <div>Activate user accounts</div>
})