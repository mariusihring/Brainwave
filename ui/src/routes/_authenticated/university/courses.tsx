import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/courses")({
	component: () => <div>Hello /_authenticated/courses!</div>,
});
