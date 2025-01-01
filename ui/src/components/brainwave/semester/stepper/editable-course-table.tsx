import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import type { Course } from "@/graphql/types";

interface EditableCourseTableProps {
	courses: Course[];
	onUpdate: (updatedCourse: Course) => void;
}

export function EditableCourseTable({ onUpdate }: EditableCourseTableProps) {
	const { courses } = useSemesterStepper();
	type ExtendedCourse = Course & { isEditing: boolean };
	const [editableCourses, setEditableCourses] = useState<ExtendedCourse[]>(
		courses.map((obj) => ({ ...obj, isEditign: false })),
	);

	const handleEdit = (id: string) => {
		setEditableCourses((prevCourses) =>
			prevCourses.map((course) =>
				course.id === id ? { ...course, isEditing: true } : course,
			),
		);
	};

	const handleSave = (id: string) => {
		const courseToUpdate = editableCourses.find((course) => course.id === id);
		if (courseToUpdate) {
			onUpdate(courseToUpdate);
			setEditableCourses((prevCourses) =>
				prevCourses.map((course) =>
					course.id === id ? { ...course, isEditing: false } : course,
				),
			);
		}
	};

	const handleChange = (
		id: string,
		field: keyof Course,
		value: string | number,
	) => {
		setEditableCourses((prevCourses) =>
			prevCourses.map((course) =>
				course.id === id ? { ...course, [field]: value } : course,
			),
		);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Department</TableHead>
					<TableHead>Teacher</TableHead>
					<TableHead>Credits</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{editableCourses.map((course) => (
					<TableRow key={course.id}>
						<TableCell>
							{course.isEditing ? (
								<Input
									value={course.name}
									onChange={(e) =>
										handleChange(course.id, "name", e.target.value)
									}
								/>
							) : (
								course.name
							)}
						</TableCell>
						<TableCell>
							{course.isEditing ? (
								<Input
									value={course.academicDepartment || ""}
									onChange={(e) =>
										handleChange(
											course.id,
											"academicDepartment",
											e.target.value,
										)
									}
								/>
							) : (
								course.academicDepartment
							)}
						</TableCell>
						<TableCell>
							{course.isEditing ? (
								<Input
									value={course.teacher || ""}
									onChange={(e) =>
										handleChange(course.id, "teacher", e.target.value)
									}
								/>
							) : (
								course.teacher
							)}
						</TableCell>
						<TableCell>
							{course.isEditing ? (
								<Input
									type="number"
									value={course.grade}
									onChange={(e) =>
										handleChange(
											course.id,
											"grade",
											parseInt(e.target.value, 10),
										)
									}
								/>
							) : (
								course.grade
							)}
						</TableCell>

						<TableCell>
							{course.isEditing ? (
								<Button onClick={() => handleSave(course.id)}>Save</Button>
							) : (
								<Button onClick={() => handleEdit(course.id)}>Edit</Button>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
