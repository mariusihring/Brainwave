import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/todos')({
  component: () => <div>Hello /_authenticated/todos!</div>
})