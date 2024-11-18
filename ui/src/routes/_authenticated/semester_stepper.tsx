import SemesterStepper from '@/components/brainwave/semester/stepper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/semester_stepper')({
  component: () => <SemesterStepper />,
})
