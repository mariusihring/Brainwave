import { useAuth } from "@/auth";
import Navigation from "@/components/brainwave/misc/navigation";
import { useUser } from "@/lib/stores/user";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated")({
	component: () => {
		const { setUser } = useUser();
		const navigate = useNavigate();

		async function checkAuth() {
			const auth = await useAuth();
			setUser(auth.user);
			if (!auth.session || !auth.user) {
				navigate({ to: "/login" });
			}
		}

		// biome-ignore lint/correctness/useExhaustiveDependencies: should run only when the page gets refreshed
		useEffect(() => {
			checkAuth();
		}, []);

		const client = new QueryClient();

		return (
			<div className="">
				<QueryClientProvider client={client}>
					<Navigation>
						<Outlet />
					</Navigation>
					<ReactQueryDevtools />
				</QueryClientProvider>
			</div>
		);
	},
});
