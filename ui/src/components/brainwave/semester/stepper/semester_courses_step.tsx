import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function SemesterCourseStep() {
	const formData = useSemesterStepper();

	const [courses, setCourses] = useState(formData.courses);
	const [assignments, setAssignments] = useState<{ [key: string]: string }>({});

	const handleAssignment = (subjectId: string, moduleId: string) => {
		setAssignments((prev) => ({ ...prev, [subjectId]: moduleId }));
	};
	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Course Information and Module Assignment</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Subject Name</TableHead>
								<TableHead>Academic Department</TableHead>
								<TableHead>Grade</TableHead>
								<TableHead>Teacher</TableHead>
								<TableHead>Assign to Module</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{courses.map((subject) => (
								<TableRow key={subject.id}>
									<TableCell className="font-medium">{subject.name}</TableCell>
									<TableCell>
										{subject.academicDepartment ? (
											<Badge variant="outline">
												{subject.academicDepartment}
											</Badge>
										) : (
											<span className="text-muted-foreground">
												Not specified
											</span>
										)}
									</TableCell>
									<TableCell>
										{subject.grade ? (
											subject.grade
										) : (
											<span className="text-muted-foreground">Not graded</span>
										)}
									</TableCell>
									<TableCell>
										{subject.teacher ? (
											subject.teacher
										) : (
											<span className="text-muted-foreground">
												Not assigned
											</span>
										)}
									</TableCell>
									<TableCell>
										<Select
											value={assignments[subject.id] || ""}
											onValueChange={(value) =>
												handleAssignment(subject.id, value)
											}
										>
											<SelectTrigger className="w-[280px]">
												<SelectValue placeholder="Select a module" />
											</SelectTrigger>
											<SelectContent>
												{formData.modules.map((module) => (
													<SelectItem key={module.id} value={module.id}>
														{module.name} ({module.etCs} ECTS)
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
