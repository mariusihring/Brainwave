import { useSemesterStepper } from "@/lib/stores/semester_stepper";

export default function SemesterReviewStep() {
  const formData = useSemesterStepper()
  return (
    <div className="space-y-4">
      <p>Placeholder for the table with imported data</p>
    </div>
  )
}
