import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/notes/flashcards/')({
  component: () => <div>Hello /_authenticated/notes/flashcards/!</div>,
})
