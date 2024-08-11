import { Lucia } from "lucia"

import { brainwave_adapter } from "./lib/auth/adapter";


export const auth = new Lucia(brainwave_adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username,
            password_hash: attributes.password_hash
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
    password_hash: string
}

