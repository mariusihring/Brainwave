import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/todos/$todo")({
	component: () => {
		const { todo } = Route.useParams();
		return <div>Hello {todo}</div>;
	},
});
