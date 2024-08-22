import { createFileRoute } from "@tanstack/react-router";
import CurrentSemesterView from "@/components/brainwave/semester/current_semester";
import SemesterCard from "@/components/brainwave/semester/semester_card";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import type {Semester} from "@/graphql/graphql.ts";
import {queryOptions} from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/semester/")({
	component: () => <Component />,
	loader: ({context: {queryClient}}) => queryClient.ensureQueryData(queryOptions({
		queryKey: ['semesters'],
		queryFn: () => execute(SEMESTER_QUERY)
	})),
	pendingComponent: () => <PendingComponent />,
});

const SEMESTER_QUERY = graphql(`
	query getAllSemester {
		semesters {
			id
			semester
			endDate
			totalEcts
			modules {
				id
				name
				ects
				grade
				startSemester
				endSemester
			}
			courses {
				id
				name
				grade
				teacher
				academicDepartment
			}
			startDate
		}
	}
`);

function Component() {
	const data = Route.useLoaderData()
	const currentDate = new Date();
	const currentSemester =
		data?.semesters.find(
			(sem: Semester) =>
				new Date(sem.startDate) <= currentDate &&
				currentDate <= new Date(sem.endDate),
		) || null;

	return (
		<div className="container mx-auto w-full">
			<h1 className="text-3xl font-bold mb-8">Semester Overview</h1>
			<CurrentSemesterView semester={currentSemester} />
			<h2 className="text-2xl font-bold mb-6">All Semesters</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.semesters.map((semester) => (
					<SemesterCard key={semester.semester} semester={semester} />
				))}
			</div>
		</div>
	);
}

function PendingComponent() {
	return (
		<div className="container mx-auto w-full">
			<h1 className="text-3xl font-bold mb-8">Semester Overview</h1>
			<Skeleton className="w-full mb-8 h-48 " />
			<h2 className="text-2xl font-bold mb-6">All Semesters</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Skeleton className="w-full mb-8 h-48 " />
				<Skeleton className="w-full mb-8 h-48 " />
				<Skeleton className="w-full mb-8 h-48 " />
			</div>
		</div>
	);
}
