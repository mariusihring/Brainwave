import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/flashcards")({
	component: () => <div>Hello /_authenticated/flashcards!</div>,
});
