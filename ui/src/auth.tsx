import { Lucia, type Session, type User } from "lucia";

import Cookies from "js-cookie";
import { brainwave_adapter } from "./lib/auth/adapter";

export const auth = new Lucia(brainwave_adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username,
			password_hash: attributes.password_hash,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	password_hash: string;
}

export async function useAuth(): Promise<
	{ user: User; session: Session } | { user: null; session: null }
> {
	const sessionId = Cookies.get(auth.sessionCookieName) ?? null;
	console.log(sessionId);

	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}

	try {
		const result = await auth.validateSession(sessionId);

		if (result.session?.fresh) {
			const sessionCookie = auth.createSessionCookie(result.session.id);

			//@ts-ignore
			const maxAgeDays = sessionCookie.attributes.maxAge / (24 * 60 * 60);
			Cookies.set(sessionCookie.name, sessionCookie.value, {
				path: "/",
				secure: true, // if using HTTPS
				sameSite: "strict",
				expires: maxAgeDays,
			});
		}
		if (!result.session) {
			const sessionCookie = auth.createBlankSessionCookie();

			//@ts-ignore
			const maxAgeDays = sessionCookie.attributes.maxAge / (24 * 60 * 60);
			Cookies.set(sessionCookie.name, sessionCookie.value, {
				path: "/",
				secure: true, // if using HTTPS
				sameSite: "strict",
				expires: maxAgeDays,
			});
			window.location.reload();
		}
		return result;
	} catch {
		const sessionCookie = auth.createBlankSessionCookie();
		//@ts-ignore
		const maxAgeDays = sessionCookie.attributes.maxAge / (24 * 60 * 60);
		Cookies.set(sessionCookie.name, sessionCookie.value, {
			path: "/",
			secure: true, // if using HTTPS
			sameSite: "strict",
			expires: maxAgeDays,
		});
		window.location.reload();
	}
	return { session: null, user: null };
}
