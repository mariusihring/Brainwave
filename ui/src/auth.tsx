import { Lucia } from "lucia"
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import { Database } from "bun:sqlite";

export const db = new Database("file:://auth.db");

const adapter = new BunSQLiteAdapter(db, {
	user: "user",
	session: "session"
});


export const auth = new Lucia(adapter, {
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

