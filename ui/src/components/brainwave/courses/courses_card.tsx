import {
    Card,
    CardContent, CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {
    BookOpenIcon,
    CalendarIcon, Edit,
    GraduationCapIcon,
    PenToolIcon, PlusIcon,
    StarIcon, TrashIcon, X,
} from "lucide-react";
import {Course, NewCourse} from "@/graphql/types.ts";
import {useMutation, useQueryClient, QueryClient} from "@tanstack/react-query";
import {execute} from "@/execute.ts";
import {
    DELETE_COURSE_MUTATION,
    UPDATE_COURSE_MUTATION
} from "@/components/brainwave/semester/stepper/semester_courses_step.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {toast} from "sonner";
import CourseForm from "@/components/brainwave/courses/form.tsx";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import {graphql} from "@/graphql";
import CreateTodoDialog from "@/components/brainwave/todos/create_todo_dialog.tsx";


export default function CoursesCard({course}: { course: Course }) {
    const queryClient = useQueryClient()
    const updateMutation = useMutation({
        mutationKey: ['update_courses'],
        mutationFn: (updatedCourse: NewCourse) => execute(UPDATE_COURSE_MUTATION, {input: updatedCourse}),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['courses_index'],
                exact: true,
                refetchType: 'all'
            })
        }
    })
    const deleteMutation = useMutation({
        mutationKey: ['delete_courses'],
        mutationFn: (deleteCourse: Course) => execute(DELETE_COURSE_MUTATION, {id: deleteCourse.id}),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['courses_index'],
                exact: true,
                refetchType: 'all'
            })
        }
    })
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [todoCourse, setTodoCourse] = useState<Course | null>(null);
    const handleUpdate = (updatedCourse: Course) => {
        console.log(updatedCourse)
        let mut = updateMutation.mutateAsync(updatedCourse);
        setEditingCourse(null);
        toast.promise(mut, {
            loading: "loading...",
            success: (data) => {
                return `${data.updateCourse.name} has been updated succesfully`
            },
            error: (data) => `Error occured while updating ${data.updateCourse.name}}`
        });
    };
    const addToFavorites = (course: Course) => {
        course.isFavorite = true
        updateMutation.mutateAsync(course)
    }
    const handleDelete = (course: Course) => {
        const mut = deleteMutation.mutateAsync(course)
        toast.promise(mut, {
            loading: "loading...",
            success: (data) => {
                return `Course was deleted successfully`
            },
            error: "Error occured while deleting course"
        });
    }

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{course.name}</span>
                        <StarIcon
                            className="mr-2 h-5 w-5 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                            fill={course.isFavorite ? "currentColor" : "none"}
                            onClick={() => addToFavorites(course)}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center ">
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70"/>
                                <span className="text-sm text-muted-foreground">next TODO</span>
                            </div>
                            <div className={`w-3 h-3 rounded-full bg-red`}/>
                            <CreateTodoDialog courseId={course.id} inCard={true}/>
                        </div>
                        <div className="flex items-center">
                            <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70"/>
                            <span className="text-sm text-muted-foreground">Grade: {course.grade}</span>
                        </div>
                        <div className="flex items-center">
                            <BookOpenIcon className="mr-2 h-4 w-4 opacity-70"/>
                            <span className="text-sm text-muted-foreground">ExamDay</span>
                        </div>
                        <div className="flex items-center">
                            <PenToolIcon className="mr-2 h-4 w-4 opacity-70"/>
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
                        <Edit className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(course)}
                    >
                        <TrashIcon className="h-4 w-4"/>
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
                        <CourseForm course={editingCourse} onSubmit={handleUpdate}/>
                    )}
                </DialogContent>
            </Dialog>
            <CreateTodoDialog courseId={course.id}/>
        </>
    );
}
