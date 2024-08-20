import Texteditor from "@/components/brainwave/editor/texteditor.tsx";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/test")({
	component: () => <Component />,
});

function Component() {
	return <Texteditor spellcheck={false} />;
}
