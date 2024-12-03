import { ModuleCard } from "@/components/brainwave/modules/module_card";
import { execute } from "@/execute";
import { graphql } from "@/graphql";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const MODULE_INDEX_QUERY = graphql(`
  query ModuleIndexQuery {
   modules {
  id
  userId
 name
etCs
startSemester
endSemester
grade
}
}
`);

export const Route = createFileRoute("/_authenticated/university/modules")({
	component: ModuleIndex,
	loader: async ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(
			queryOptions({
				queryKey: ["modules_index"],
				queryFn: () => execute(MODULE_INDEX_QUERY),
			}),
		),
});

function ModuleIndex() {
	const {
		data: { modules },
		error,
	} = useQuery({
		queryKey: ["modules_index"],
		queryFn: () => execute(MODULE_INDEX_QUERY),
		initialData: Route.useLoaderData(),
	});
	return (
		<div className="container mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">Modules</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{modules.map((module) => (
					<ModuleCard key={module.id} module={module} />
				))}
			</div>
		</div>
	);
}
