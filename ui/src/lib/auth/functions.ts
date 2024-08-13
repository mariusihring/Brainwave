import { auth } from "@/auth";
import Cookies from "js-cookie";
import { type DatabaseUser, generateIdFromEntropySize } from "lucia";
import api_client from "../axios_client";

export async function login(username: string, password: string) {
	const existingUser = (
		await api_client.post("/auth/get_user", {
			username: username,
		})
	).data as DatabaseUser | undefined;
	if (!existingUser) {
		return Promise.reject("Username invalid");
	}

	const pw = existingUser.attributes.password_hash === password;
	if (!pw) {
		return Promise.reject("Password invalid");
	}
	const session = await auth.createSession(existingUser.id, {});
	const sessionCookie = auth.createSessionCookie(session.id);
	//@ts-ignore
	const maxAgeDays = sessionCookie.attributes.maxAge / (24 * 60 * 60);
	Cookies.set(sessionCookie.name, sessionCookie.value, {
		path: "/",
		secure: false, // if using HTTPS
		sameSite: "lax",
		expires: maxAgeDays,
	});
}
export async function signup(username: string, password: string) {
	// const passwordHash = await bcrypt.hash(password, 10);
	const userId = generateIdFromEntropySize(10);
	try {
		await api_client.post("/auth/create_user", {
			id: userId,
			username: username,
			hash: password,
		});

		const session = await auth.createSession(userId, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		//@ts-ignore
		const maxAgeDays = sessionCookie.attributes.maxAge / (24 * 60 * 60);
		Cookies.set(sessionCookie.name, sessionCookie.value, {
			path: "/",
			secure: false, // if using HTTPS
			sameSite: "lax",
			expires: maxAgeDays,
		});
	} catch (e) {
		return Promise.reject("Username allready used");
	}
}
