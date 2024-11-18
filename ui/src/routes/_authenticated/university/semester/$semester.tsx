import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/university/semester/$semester")({
	component: () => <div>Hello /_authenticated/semester/$semester!</div>,
});
