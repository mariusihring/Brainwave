import { TooltipProvider } from "@radix-ui/react-tooltip";
import {Outlet,  createRootRouteWithContext} from "@tanstack/react-router";
import type { Session, User } from "lucia";
import type {QueryClient} from "@tanstack/react-query";

interface RouterContext {
	auth: {
		session: Session;
		user: User;
	};
	queryClient: QueryClient
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
