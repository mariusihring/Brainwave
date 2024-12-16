import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { Session, User } from "lucia";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface RouterContext {
	auth: {
		session: Session;
		user: User;
	};
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<TooltipProvider>
				<Outlet />
				<Toaster richColors position="top-center" />
				<TanStackRouterDevtools />
			</TooltipProvider>
		</>
	),
});
