import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { Semester } from "@/graphql/types";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const CREATE_SEMESTER_MUTATION = graphql(`
  mutation createSemesterMutation($input: NewSemester!) {
    createSemester(input: $input) {
      id
      semester
    }
  }
`);

export default function SemesterDateStep() {
	const formData = useSemesterStepper();
	const semesterMutation = useMutation({
		mutationKey: [`create_semester_${formData.semester}`],
		mutationFn: () =>
			execute(CREATE_SEMESTER_MUTATION, {
				input: {
					totalEcts: 0,
					startDate: formData.startDate?.toISOString().split("T")[0],
					endDate: formData.endDate?.toISOString().split("T")[0],
					semester: formData.semester as number,
				},
			}),
	});

	const handleCreateSemester = () => {
		toast.promise(semesterMutation.mutateAsync(), {
			loading: "Loading...",
			success: (data) => {
				formData.nextStep();
				formData.setCreatedSemesterId(data.createSemester.id);
				return `Successfully created the ${data.createSemester.semester} Semester`;
			},
			error: (err) => {
				return err.message;
			},
		});
	};

	const isDisabled =
		!formData.semester || !formData.startDate || !formData.endDate;
	return (
		<>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="semester">Semester Number</Label>
					<Select
						value={formData.semester?.toString()}
						onValueChange={(value) => formData.setSemester(Number(value))}
					>
						<SelectTrigger id="semester">
							<SelectValue placeholder="Select semester" />
						</SelectTrigger>
						<SelectContent>
							{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
								<SelectItem key={num} value={num.toString()}>
									{num} Semester
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row sm:space-x-4">
						<div className="flex-1 space-y-2">
							<Label>Start Date</Label>
							<Calendar
								mode="single"
								selected={formData.startDate as Date | undefined}
								onSelect={(date) => formData.setStartDate(date)}
								className="rounded-md border"
							/>
						</div>
						<div className="flex-1 space-y-2 mt-4 sm:mt-0">
							<Label>End Date</Label>
							<Calendar
								mode="single"
								selected={formData.endDate as Date | undefined}
								onSelect={(date) => formData.setEndDate(date)}
								className="rounded-md border"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8 flex justify-between">
				<Button
					onClick={formData.lastStep}
					disabled={formData.activeStep === 0}
				>
					Back
				</Button>
				<Button disabled={isDisabled} onClick={handleCreateSemester}>
					{formData.activeStep === formData.steps.length - 1
						? "Finish"
						: "Next"}
				</Button>
			</div>
		</>
	);
}
