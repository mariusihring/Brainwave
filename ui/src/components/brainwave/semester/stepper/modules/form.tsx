import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Module } from "@/graphql/types";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import { useEffect, useState } from "react";

type ModuleFormProps = {
	module?: Module;
	onSubmit: (module: Module) => void;
};
export default function ModuleForm({ module, onSubmit }: ModuleFormProps) {
	const { semesters } = useSemesterStepper();
	const [initialData, setInitialData] = useState<Partial<Module>>(
		module || {
			name: "",
			etCs: 0,
			startSemester: "",
			endSemester: "same",
			grade: undefined,
		},
	);

	useEffect(() => {
		if (semesters.length === 1 && initialData.startSemester) {
			setInitialData((prev) => ({ ...prev, startSemester: semesters[0].id }));
		}
	}, [semesters, initialData.startSemester]);

	const handleChange = (name: string, value: string | number) => {
		setInitialData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			...initialData,
			id: module?.id || "",
			etCs: Number(initialData.etCs),
			grade: initialData.grade ? Number(initialData.grade) : undefined,
		} as Module);
	};
	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="name">Module Name</Label>
				<Input
					id="name"
					value={initialData.name}
					onChange={(e) => handleChange("name", e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="ects">ECT's</Label>
				<Input
					id="ects"
					type="number"
					value={initialData.etCs}
					onChange={(e) => handleChange("etCs", e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="startSemester">Start Semester</Label>
				<Select
					value={initialData.startSemester}
					onValueChange={(value) => handleChange("startSemester", value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select the semester the module starts in" />
					</SelectTrigger>
					<SelectContent>
						{semesters.map((semester) => (
							<SelectItem key={semester.id} value={semester.id}>
								Semester {semester.semester}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="endSemester">End Semester (Optional)</Label>
				<Select
					value={initialData.endSemester || "same"}
					onValueChange={(value) =>
						//@ts-ignore
						handleChange("endSemester", value === "same" ? null : value)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select the semester the module ends in" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="same">Same as Start Semester</SelectItem>
						{semesters.map((semester) => (
							<SelectItem key={semester.id} value={semester.id}>
								Semester {semester.semester}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="grade">Grade (Optional)</Label>
				<Input
					id="grade"
					type="number"
					step="0.1"
					value={initialData.grade || ""}
					onChange={(e) => handleChange("grade", e.target.value)}
				/>
			</div>
			<Button type="submit">{module ? "Update Module" : "Add Module"}</Button>
		</form>
	);
}
