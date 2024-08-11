import DashboardIdea from "@/components/brainwave/misc/dashboard/idea";
import { createFileRoute } from "@tanstack/react-router";



export const Route = createFileRoute("/_authenticated/")({
	component: () => <Dashboard />,
});


function Dashboard() {
	return (
		<div className="antialiased">
			<DashboardIdea />
		</div>
	
	)
}