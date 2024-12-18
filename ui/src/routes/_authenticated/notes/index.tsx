import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notes/')({
  component: () => <div>Hello /_authenticated/notes/!</div>,
})
