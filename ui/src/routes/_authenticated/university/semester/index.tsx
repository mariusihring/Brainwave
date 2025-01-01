import CurrentSemesterView from "@/components/brainwave/semester/current_semester";
import SemesterCard from "@/components/brainwave/semester/semester_card";

import CreateSemesterDialog from "@/components/brainwave/semester/create_semester_dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { execute } from "@/execute.ts";
import { graphql } from "@/graphql";
import type { Semester } from "@/graphql/graphql.ts";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/semester/")({
	component: () => <SemesterIndex />,
	loader: async ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(
			queryOptions({
				queryKey: ["semesters"],
				queryFn: () => execute(SEMESTER_QUERY),
			}),
		),
	pendingComponent: () => <PendingSemesterIndex />,
});

export const SEMESTER_QUERY = graphql(`
  query getAllSemester {
    semesters {
      id
      semester
      endDate
      totalEcTs
      modules {
        id
        name
        etCs
        grade
        startSemester
        endSemester
        courses {
          id
          name
          grade
          teacher
          academicDepartment
        }
      }
      startDate
    }
  }
`);

function SemesterIndex() {
	const {
		data: { semesters },
		error,
	} = useQuery({
		queryKey: ["semesters"],
		queryFn: () => execute(SEMESTER_QUERY),
		initialData: Route.useLoaderData(),
	});
	if (error) console.log(error);
	const navigate = useNavigate();
	if (semesters.length === 0) {
		navigate({ to: "/semester_stepper" });
	}
	const currentDate = new Date();
	const currentSemester =
		semesters.find(
			(sem: Semester) =>
				new Date(sem.startDate) <= currentDate &&
				currentDate <= new Date(sem.endDate),
		) || null;

	return (
		<div className="w-full">
			<div className="flex w-full justify-between">
				<h1 className="text-3xl font-bold mb-8">Semester Overview</h1>
				<CreateSemesterDialog />
			</div>

			<CurrentSemesterView semester={currentSemester} />
			<h2 className="text-2xl font-bold mb-6">All Semesters</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{semesters.map((semester) => (
					<SemesterCard key={semester.semester} semester={semester} />
				))}
			</div>
		</div>
	);
}

function PendingSemesterIndex() {
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
