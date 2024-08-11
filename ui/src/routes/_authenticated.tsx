import { useAuth } from "@/auth";
import Navigation from "@/components/brainwave/misc/navigation";
import { createFileRoute, useNavigate, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

  



export const Route = createFileRoute("/_authenticated")({
	component: () => {
		const navigate = useNavigate();
		async function checkAuth() {
			const auth = await useAuth();
			console.log(auth);
			if (!auth.session || !auth.user) {
				navigate({ to: "/login" });
			}
		}
		// biome-ignore lint/correctness/useExhaustiveDependencies: should run only when the page gets refreshed
		useEffect(() => {
			checkAuth();
		}, []);

		return (
			<Navigation>
				<Outlet/>
			</Navigation>
		)
	},
});
