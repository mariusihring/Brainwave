import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { graphql } from "@/graphql";
import type { Course, Module } from "@/graphql/graphql";
import { useSemesterStepper } from "@/lib/stores/semester_stepper";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { EditableCourseTable } from "./editable-course-table";
import { execute } from "@/execute";
import type { NewCourse } from "@/graphql/graphql";
import { Button } from "@/components/ui/button";

export const UPDATE_COURSE_MUTATION = graphql(`
  mutation UpdateCourse($input: NewCourse!) {
    updateCourse(input: $input) {
      id
      academicDepartment
      grade
      moduleId
      name
      teacher
      isFavorite
    }
  }
`);

export const DELETE_COURSE_MUTATION = graphql(`
  mutation DeleteCourse($id: UUID!) {
    deleteCourse(id: $id)
  }
`);

interface ExtendedModule extends Module {
	description?: string;
	courses: Course[];
}

interface EditableCourse extends Course {
	isEditing: boolean;
}
export default function ModuleAssignmentMinimal() {
	const updateCourseMutation = useMutation({
		mutationKey: [`update_course_${new Date().getUTCMinutes()}`],
		mutationFn: (input: NewCourse) =>
			execute(UPDATE_COURSE_MUTATION, { input }),
	});

	const {
		activeStep,
		steps,
		lastStep,
		nextStep,
		courses: coursesFromStore,
		modules: modulesFromStore,
	} = useSemesterStepper();
	const [courses, setCourses] = useState<Course[]>(coursesFromStore);
	const [modules, setModules] = useState<ExtendedModule[]>(
		modulesFromStore.map((mod) => ({ ...mod, courses: [] })),
	);
	const [editableCourses, setEditableCourses] = useState<EditableCourse[]>(
		coursesFromStore.map((course) => ({ ...course, isEditing: false })),
	);

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;

		if (!destination) return;

		const sourceIndex = source.index;
		const destinationIndex = destination.index;

		const newCourses = Array.from(courses);
		const newModules = Array.from(modules);

		let movedItem: Course | undefined;

		if (source.droppableId === "unassigned") {
			movedItem = newCourses.splice(sourceIndex, 1)[0];
		} else {
			const sourceModule = newModules.find((m) => m.id === source.droppableId);
			if (sourceModule) {
				movedItem = sourceModule.courses.splice(sourceIndex, 1)[0];
			}
		}

		if (!movedItem) return;

		movedItem = {
			...movedItem,
			moduleId:
				destination.droppableId === "unassigned" ? "" : destination.droppableId,
		};

		if (destination.droppableId === "unassigned") {
			newCourses.splice(destinationIndex, 0, movedItem);
		} else {
			const destinationModule = newModules.find(
				(m) => m.id === destination.droppableId,
			);
			if (destinationModule) {
				destinationModule.courses.splice(destinationIndex, 0, movedItem);
				updateCourseMutation.mutateAsync({
					...movedItem,
					id: movedItem.id,
					moduleId: destinationModule.id,
				});
			}
		}

		setCourses(newCourses);
		setModules(newModules);
	};

	const handleCourseUpdate = (updatedCourse: Course) => {
		setEditableCourses((prevCourses) =>
			prevCourses.map((course) =>
				course.id === updatedCourse.id
					? { ...updatedCourse, isEditing: false }
					: course,
			),
		);

		setCourses((prevCourses) =>
			prevCourses.map((course) =>
				course.id === updatedCourse.id ? updatedCourse : course,
			),
		);
		const course = courses.find((c) => c.id === updatedCourse.id) as Course;
		const updated_course: NewCourse = {
			id: updatedCourse.id,
			name: updatedCourse.name,
			teacher: updatedCourse.teacher,
			academicDepartment: updatedCourse.academicDepartment,
			grade: updatedCourse.grade,
		};
		updateCourseMutation.mutateAsync(updated_course);
	};
	console.log(courses);
	return (
		<TooltipProvider>
			<div className="container mx-auto py-10">
				<Tabs defaultValue="drag-drop">
					<TabsList>
						<TabsTrigger value="drag-drop">Drag and Drop</TabsTrigger>
						<TabsTrigger value="edit-courses">Edit Courses</TabsTrigger>
					</TabsList>
					<TabsContent value="drag-drop">
						<DragDropContext onDragEnd={onDragEnd}>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<Card className="lg:col-span-1">
									<CardHeader>
										<CardTitle>Available Courses</CardTitle>
										<CardDescription>
											Drag courses to assign them to modules
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Droppable droppableId="unassigned">
											{(provided) => (
												<ScrollArea className="h-[calc(100vh-200px)]">
													<ul
														{...provided.droppableProps}
														ref={provided.innerRef}
														className="space-y-2"
													>
														{courses.map((course, index) => (
															<Draggable
																key={course.id}
																draggableId={course.id}
																index={index}
															>
																{(provided) => (
																	<li
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		className="p-2 bg-secondary rounded-md text-sm"
																	>
																		<Tooltip>
																			<TooltipTrigger asChild>
																				<div>
																					<div className="font-medium">
																						{course.name}
																					</div>
																					<div className="text-xs text-muted-foreground">
																						{course.academicDepartment}
																					</div>
																				</div>
																			</TooltipTrigger>
																			<TooltipContent
																				side="right"
																				className="max-w-xs"
																			>
																				<p>
																					<strong>Department:</strong>{" "}
																					{course.academicDepartment}
																				</p>
																				<p>
																					<strong>Teacher:</strong>{" "}
																					{course.teacher || "Not assigned"}
																				</p>
																				{course.grade && (
																					<p>
																						<strong>Grade:</strong>{" "}
																						{course.grade}
																					</p>
																				)}
																			</TooltipContent>
																		</Tooltip>
																	</li>
																)}
															</Draggable>
														))}
														{provided.placeholder}
													</ul>
													<ScrollBar />
												</ScrollArea>
											)}
										</Droppable>
									</CardContent>
								</Card>
								<div className="lg:col-span-2 space-y-6">
									{modules.map((module) => (
										<Card key={module.id}>
											<CardHeader>
												<CardTitle>{module.name}</CardTitle>
												<CardDescription>
													{module.description} ({module.etCs} ECTS)
												</CardDescription>
											</CardHeader>
											<Droppable droppableId={module.id}>
												{(provided) => (
													<CardContent
														{...provided.droppableProps}
														ref={provided.innerRef}
														className="h-[300px] overflow-y-auto p-4"
													>
														<ScrollArea className="h-full">
															<ul className="space-y-2 min-h-[100px]">
																{module.courses?.map((course, index) => (
																	<Draggable
																		key={course.id}
																		draggableId={course.id}
																		index={index}
																	>
																		{(provided) => (
																			<li
																				ref={provided.innerRef}
																				{...provided.draggableProps}
																				{...provided.dragHandleProps}
																				className="p-2 bg-primary/10 rounded-md text-sm"
																			>
																				<Tooltip>
																					<TooltipTrigger asChild>
																						<div>
																							<div className="font-medium">
																								{course.name}
																							</div>
																							<div className="text-xs text-muted-foreground">
																								{course.academicDepartment}
																							</div>
																						</div>
																					</TooltipTrigger>
																					<TooltipContent
																						side="right"
																						className="max-w-xs"
																					>
																						<p>
																							<strong>Department:</strong>{" "}
																							{course.academicDepartment}
																						</p>
																						<p>
																							<strong>Teacher:</strong>{" "}
																							{course.teacher || "Not assigned"}
																						</p>
																						{course.grade && (
																							<p>
																								<strong>Grade:</strong>{" "}
																								{course.grade}
																							</p>
																						)}
																					</TooltipContent>
																				</Tooltip>
																			</li>
																		)}
																	</Draggable>
																))}
																{provided.placeholder}
															</ul>
														</ScrollArea>
													</CardContent>
												)}
											</Droppable>
										</Card>
									))}
								</div>
							</div>
						</DragDropContext>
					</TabsContent>
					<TabsContent value="edit-courses">
						<Card>
							<CardHeader>
								<CardTitle>Edit Courses</CardTitle>
								<CardDescription>Modify course details</CardDescription>
							</CardHeader>
							<CardContent>
								<EditableCourseTable
									courses={editableCourses}
									onUpdate={handleCourseUpdate}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
				<div className="mt-8 flex justify-between">
					<Button onClick={lastStep} disabled={activeStep === 0}>
						Back
					</Button>
					<Button onClick={nextStep}>
						{activeStep === steps.length - 1 ? "Finish" : "Next"}
					</Button>
				</div>
			</div>
		</TooltipProvider>
	);
}
