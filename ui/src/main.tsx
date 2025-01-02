import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { routeTree } from "./routeTree.gen";

import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/brainwave/theme/theme_provider";

const queryClient = new QueryClient();
// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		auth: undefined!,
		queryClient: queryClient,
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
		</ThemeProvider>
	</React.StrictMode>,
);
