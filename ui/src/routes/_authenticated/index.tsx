
import { useUser } from "@/lib/stores/user";
import { createFileRoute } from "@tanstack/react-router";



export const Route = createFileRoute("/_authenticated/")({
	component: () => <Dashboard />,
});


function Dashboard() {
	const {user} = useUser()
	return (
		<div className="antialiased">
			<p>{user?.username}</p>
		</div>
	
	)
}