import type { Semester } from "@/__generated__/graphql";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { getDifficultyColor } from "@/lib/semester/functions.ts";
import {
  AwardIcon,
  BookOpenIcon,
  CalendarIcon,
  GraduationCapIcon,
  PenToolIcon,
} from "lucide-react";

export default function SemesterCard({ semester }: { semester: Semester }) {
  const courses = semester.modules.flatMap((module) => module.courses);
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
    </Card>
  );
}
