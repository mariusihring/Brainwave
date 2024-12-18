import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notes/markdown/')({
  component: () => <div>Hello /_authenticated/notes/markdown/!</div>,
})
