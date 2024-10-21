import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/university/courses/$courses')({
  component: () => <div>Hello /_authenticated/university/courses/$courses!</div>
})