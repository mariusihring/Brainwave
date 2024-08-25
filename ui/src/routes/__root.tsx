import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { Session, User } from "lucia";

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
				{/*<TanStackRouterDevtools />*/}
			</TooltipProvider>
		</>
	),
});
