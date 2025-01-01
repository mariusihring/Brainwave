import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import { Link } from "@tanstack/react-router";

export default function SemesterReviewStep() {
	const formData = useSemesterStepper();
	//TODO: show all the new stuff here but dont want to do that rn
	return (
		<div className="space-y-4">
			<p>Placeholder for the table with imported data</p>
			<Link to="/university/semester">Done and go back</Link>
		</div>
	);
}
