import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { Session, User } from "lucia";

interface RouterContext {
	auth: {
		session: Session;
		user: User;
	};
}

export const Route = createRootRoute({
	component: () => (
		<>
		<TooltipProvider>
		<Outlet />
		<TanStackRouterDevtools />
		</TooltipProvider>
			
		</>
	),
});
