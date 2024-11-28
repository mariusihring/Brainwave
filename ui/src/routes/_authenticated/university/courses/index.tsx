import CoursesCard from "@/components/brainwave/courses/courses_card.tsx";
import { FavoriteCourses } from "@/components/brainwave/courses/favorites.tsx";
import { execute } from "@/execute.ts";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/courses/")({
	component: () => <Coursesindex />,
});

function Coursesindex() {
	return (
		<div className="w-full">
			<div className="flex w-full justify-between">
				<h1 className="text-3xl font-bold mb-8">Courses Overview</h1>
			</div>
			<FavoriteCourses />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<CoursesCard courses="" />
				<CoursesCard courses="" />
				<CoursesCard courses="" />
			</div>
		</div>
	);
}
