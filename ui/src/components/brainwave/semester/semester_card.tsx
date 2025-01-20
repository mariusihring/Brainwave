import type { Semester } from "@/__generated__/graphql";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent, CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { getDifficultyColor } from "@/lib/semester/functions.ts";
import {
  AwardIcon,
  BookOpenIcon,
  CalendarIcon,
  GraduationCapIcon,
  PenToolIcon, TrashIcon,
} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Course} from "@/graphql/types.ts";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {execute} from "@/execute.ts";
import {DELETE_COURSE_MUTATION} from "@/components/brainwave/semester/stepper/semester_courses_step.tsx";
import {graphql} from "@/graphql";

export default function SemesterCard({ semester }: { semester: Semester }) {
  const courses = semester.modules.flatMap((module) => module.courses);
  const queryClient = useQueryClient()

  const DELETE_SEMESTER_MUTATION = graphql(`
    mutation DeleteSemester($id: UUID!) {
      deleteSemester(id: $id)
    }
  `)

  const deleteMutation = useMutation({
    mutationKey: ['delete_semester'],
    mutationFn: (deleteSemester: Semester) => execute(DELETE_SEMESTER_MUTATION, {id: deleteSemester.id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['semesters'],
        exact: true,
        refetchType: 'all'
      })
    }
  })
  const handleDelete = (semester: Semester) => {
    const mut = deleteMutation.mutateAsync(semester)
    toast.promise(mut, {
      loading: "loading...",
      success: (data) => {
        return `Semester was deleted successfully`
      },
      error: "Error occured while deleting semester"
    });
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Semester {semester.semester}</span>
          <Badge variant="outline">{semester.mainSubjectArea}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-sm text-muted-foreground">
                {new Date(semester.startDate).toLocaleDateString()} -{" "}
                {new Date(semester.endDate).toLocaleDateString()}
              </span>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${getDifficultyColor(semester.difficulty)}`}
              title={`Difficulty: ${semester.difficulty}`}
            />
          </div>
          <div className="flex items-center">
            <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">
              {semester.totalEcts} ECTS
            </span>
          </div>
          <div className="flex items-center">
            <BookOpenIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">
              {courses.length} Courses
            </span>
          </div>
          <div className="flex items-center">
            <PenToolIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm text-muted-foreground">
              {courses.length} Exams
            </span>
          </div>
          {semester.averageGrade !== null && (
            <div className="flex items-center">
              <AwardIcon className="mr-2 h-4 w-4 opacity-70" />
              {/*semester.averageGrade.toFixed(2) ||*/}
              <span className="text-sm text-muted-foreground">
                Average Grade: {0}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="w-full flex items-end justify-end">
        <Button
            variant="outline"
            size="icon"
            onClick={() => handleDelete(semester)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
