import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notebooks')({
  component: () => <div>Hello /_authenticated/notebooks!</div>
})