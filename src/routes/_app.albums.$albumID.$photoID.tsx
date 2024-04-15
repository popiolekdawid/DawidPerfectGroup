import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/albums/$albumID/$photoID')({
  component: () => <div>Hello /albums/$albumID/photoID!</div>
})
