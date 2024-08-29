import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/todos/$todo")({
	component: () => {
		const { todo } = Route.useParams();
		return <div>Hello {todo}</div>;
	},
});
