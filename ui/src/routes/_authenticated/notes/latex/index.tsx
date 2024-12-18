import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notes/latex/')({
  component: () => <div>Hello /_authenticated/notes/latex/!</div>,
})
