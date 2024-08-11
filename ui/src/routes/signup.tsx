import Signup from "@/components/brainwave/misc/signup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
	component: () => <SignupComponent />,
});

function SignupComponent() {
	return (
		<div className="flex w-screen h-screen items-center justify-center ">
			<Signup />
		</div>
	);
}
