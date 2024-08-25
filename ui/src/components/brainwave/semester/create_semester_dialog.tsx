import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import type { Semester } from "@/graphql/graphql.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

const CREATE_SEMESTER_MUTATION = graphql(`
    mutation createSemesterMutation($input: NewSemester!) {
        createSemester(input: $input) {
            id
        }
    }
`);

export default function CreateSemesterDialog() {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const router = useRouter();
	const [semester, setSemester] = useState<Partial<Semester>>({
		courses: [],
		modules: [],
		semester: 1,
		totalEcts: 0,
	});
	const mutation = useMutation({
		mutationKey: ["create_semester"],
		mutationFn: () =>
			execute(CREATE_SEMESTER_MUTATION, {
				input: {
					semester: semester.semester || 1,
					endDate: semester.endDate,
					startDate: semester.startDate,
					totalEcts: semester.totalEcts || 0,
				},
			}),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ["semesters"] });
		},
	});
	const handleCreate = () => {
		// Here you would typically send the semester data to your backend
		mutation.mutate();
		router.invalidate();
		setOpen(false);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-[200px]">
					<PlusCircleIcon className="mr-2 h-4 w-4" />
					Create Semester
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="semester" className="text-right">
							Semester
						</Label>
						<Input
							id="semester"
							type="number"
							className="col-span-3"
							value={semester.semester}
							onChange={(e) =>
								setSemester({
									...semester,
									semester: Number.parseInt(e.target.value),
								})
							}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="startDate" className="text-right">
							Start Date
						</Label>
						<Input
							id="startDate"
							type="date"
							className="col-span-3"
							value={semester.startDate}
							onChange={(e) =>
								setSemester({ ...semester, startDate: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="endDate" className="text-right">
							End Date
						</Label>
						<Input
							id="endDate"
							type="date"
							className="col-span-3"
							value={semester.endDate}
							onChange={(e) =>
								setSemester({ ...semester, endDate: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="totalEcts" className="text-right">
							Total ECTS
						</Label>
						<Input
							id="totalEcts"
							type="number"
							className="col-span-3"
							value={semester.totalEcts}
							onChange={(e) =>
								setSemester({
									...semester,
									totalEcts: Number.parseInt(e.target.value),
								})
							}
						/>
					</div>
				</div>
				<div className="flex justify-end">
					<Button onClick={handleCreate}>Create Semester</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
