import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/modules")({
	component: () => <div>Hello /_authenticated/university/modules!</div>,
});
