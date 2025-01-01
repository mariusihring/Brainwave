import { Badge } from "@/components/ui/badge.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import type { Course, Semester } from "@/graphql/graphql.ts";
import {
	calculateProgress,
	getDifficultyColor,
} from "@/lib/semester/functions";
import {
	BookOpenIcon,
	CalendarIcon,
	ClockIcon,
	GraduationCapIcon,
	PenToolIcon,
} from "lucide-react";

export default function CurrentSemesterView({
	semester,
}: {
	semester: Semester | null;
}) {
	if (!semester) {
		return (
			<Card className="w-full mb-8">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span className="text-2xl">No current semester found</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					Please check if you have semesters added / or you are currently not in
					the timespan of one of them
				</CardContent>
			</Card>
		);
	}
	const progress = calculateProgress(semester.startDate, semester.endDate);
	const courses: Course[] = semester.modules.flatMap((mod) => mod.courses);
	//TODO: add exams, examsCount, calculateDiffictulty, set Deadlines

	return (
		<Card className="w-full mb-8">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className="text-2xl">
						Current Semester: {semester.semester}
					</span>
					<Badge variant="outline" className="text-lg">
						{semester.mainSubjectArea}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<CalendarIcon className="mr-2 h-5 w-5 opacity-70" />
								<span className="text-muted-foreground">
									{new Date(semester.startDate).toLocaleDateString()} -{" "}
									{new Date(semester.endDate).toLocaleDateString()}
								</span>
							</div>
							<div
								className={`w-4 h-4 rounded-full ${getDifficultyColor(semester.difficulty)}`}
								title={`Difficulty: ${semester.difficulty}`}
							/>
						</div>
						<div className="flex items-center">
							<GraduationCapIcon className="mr-2 h-5 w-5 opacity-70" />
							<span className="text-muted-foreground">
								{semester.totalEcTs} ECTS
							</span>
						</div>
						<div className="flex items-center">
							<BookOpenIcon className="mr-2 h-5 w-5 opacity-70" />
							<span className="text-muted-foreground">
								{courses.length} Courses
							</span>
						</div>
						<div className="flex items-center">
							<PenToolIcon className="mr-2 h-5 w-5 opacity-70" />
							<span className="text-muted-foreground">
								{semester.examsCount || 0} Exams
							</span>
						</div>
						<div className="space-y-2">
							<span className="font-medium flex items-center">
								<ClockIcon className="mr-2 h-5 w-5 opacity-70" />
								Key Deadlines
							</span>
							<ul className="text-muted-foreground space-y-1">
								{/*{semester.keyDeadlines.map((deadline, index) => (*/}
								{/*	<li key={index}>*/}
								{/*		{new Date(deadline.date).toLocaleDateString()}:{" "}*/}
								{/*		{deadline.event}*/}
								{/*	</li>*/}
								{/*))}*/}
							</ul>
						</div>
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<span className="font-medium">Courses</span>
							<ul className="space-y-2">
								{courses.map((course, index) => (
									<li
										//@biome-ignore-line
										key={`${course}_${index}`}
										className="flex justify-between items-center"
									>
										<span>{course.name}</span>
										<span className="text-muted-foreground">
											Grade: {course.grade || "None"}
										</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="font-medium">Progress</span>
								<span className="text-muted-foreground">{progress}%</span>
							</div>
							<Progress value={progress} className="w-full" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
