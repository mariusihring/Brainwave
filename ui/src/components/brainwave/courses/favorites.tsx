import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {BookOpenIcon, CalendarIcon, Edit, GraduationCapIcon, PenToolIcon, StarIcon} from "lucide-react";
import {Course, NewCourse} from "@/graphql/types.ts";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import CourseForm from "@/components/brainwave/courses/form.tsx";
import {List} from "postcss/lib/list";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {execute} from "@/execute.ts";
import {UPDATE_COURSE_MUTATION} from "@/components/brainwave/semester/stepper/semester_courses_step.tsx";
import {useState} from "react";
import {toast} from "sonner";

export function FavoriteCourses({ favorites }: { favorites: Course[] }) {
	const queryClient = useQueryClient()
	const updateMutation = useMutation({
		mutationKey: ['courses_index'],
		mutationFn: (updatedCourse: NewCourse) => execute(UPDATE_COURSE_MUTATION, {input: updatedCourse}),
		onSuccess: () => queryClient.invalidateQueries({
			queryKey: ['courses_index'],
			exact: true,
			refetchType: 'all'
		})
	})
	const [editingCourse, setEditingCourse] = useState<Course | null>(null);
	const handleUpdate = (updatedCourse: Course) => {
		console.log(updatedCourse)
		updateMutation.mutateAsync(updatedCourse);
		setEditingCourse(null);
		toast.success("Course updated", {
			description: `${updatedCourse.name} has been updated succesfully`,
		});
	};
	const removeFromFavorites = (course: Course) => {
		course.isFavorite = false
		updateMutation.mutateAsync(course)
	}
	return (
		<Card className="w-full mb-8">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center">
						<StarIcon className="mr-2 h-5 w-5 opacity-70"
						/>
						Favorites
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{favorites.map(course  => (
					// @ts-ignore
					<div>
						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>{course.name}</span>
									<StarIcon
										className="mr-2 h-5 w-5 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
										fill={course.isFavorite ? "currentColor" : "none"}
										onClick={() => removeFromFavorites(course)}
									/>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
											<span className="text-sm text-muted-foreground">next TODO</span>
										</div>
										<div className={`w-3 h-3 rounded-full bg-red`} />
									</div>
									<div className="flex items-center">
										<GraduationCapIcon className="mr-2 h-4 w-4 opacity-70" />
										<span className="text-sm text-muted-foreground">Grade: {course.grade}</span>
									</div>
									<div className="flex items-center">
										<BookOpenIcon className="mr-2 h-4 w-4 opacity-70" />
										<span className="text-sm text-muted-foreground">ExamDay</span>
									</div>
									<div className="flex items-center">
										<PenToolIcon className="mr-2 h-4 w-4 opacity-70" />
										<span className="text-sm text-muted-foreground">ExamType</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="w-full flex items-end justify-end">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setEditingCourse(course)}
								>
									<Edit className="h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
						<Dialog
							open={!!editingCourse}
							onOpenChange={() => setEditingCourse(null)}
						>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Edit Module</DialogTitle>
								</DialogHeader>
								{editingCourse && (
									<CourseForm course={editingCourse} onSubmit={handleUpdate} />
								)}
							</DialogContent>
						</Dialog>
					</div>
				))}
				</div>
			</CardContent>
		</Card>
	);
}
