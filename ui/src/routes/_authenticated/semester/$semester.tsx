import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/semester/$semester")({
	component: () => <div>Hello /_authenticated/semester/$semester!</div>,
});
