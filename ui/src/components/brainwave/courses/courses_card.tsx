import type { Courses } from "@/__generated__/graphql";
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
    PenToolIcon, StarIcon,
} from "lucide-react";

function addToFavorites(course: Courses){

}

export default function CoursesCard({ courses }: { courses: Courses }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Name</span>
                    <StarIcon className="mr-2 h-5 w-5 opacity-70" onClick={
                        //add to favorites
                        addToFavorites(courses)
                    }/>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-sm text-muted-foreground">
								next TODO
							</span>
                        </div>
                        <div
                            className={`w-3 h-3 rounded-full bg-red`}
                        />
                    </div>
                    <div className="flex items-center">
                        <GraduationCapIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-sm text-muted-foreground">
							ECTS
						</span>
                    </div>
                    <div className="flex items-center">
                        <BookOpenIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-sm text-muted-foreground">
							ExamDay
						</span>
                    </div>
                    <div className="flex items-center">
                        <PenToolIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-sm text-muted-foreground">
							ExamType
						</span>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
