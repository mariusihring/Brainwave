import {auth, useAuth} from "@/auth";
import Navigation from "@/components/brainwave/misc/navigation";
import { useUser } from "@/lib/stores/user";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Cookies from "js-cookie";

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
		const sessionId = Cookies.get(auth.sessionCookieName) ?? null;

		const client = new ApolloClient({
			uri: 'http://127.0.0.1:3000',
			cache: new InMemoryCache(),
			headers: {
				Authorization: `Bearer ${sessionId}`
			}
		});

		return (
			<div className="">
				<ApolloProvider client={client}>
					<Navigation>
						<Outlet />
					</Navigation>
				</ApolloProvider>
			</div>
		);
	},
});
