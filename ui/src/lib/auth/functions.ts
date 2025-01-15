import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
import { type DatabaseUser, generateIdFromEntropySize, Session } from "lucia";
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
	const pw = await bcrypt.compare(
		password,
		existingUser.attributes.password_hash,
	);
	if (!pw) {
		return Promise.reject("Password invalid");
	}
	const session = await auth.createSession(
		existingUser.id,
		{},
		{
			sessionId: uuidv4(),
		},
	);
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
	const userId = uuidv4();
	try {
		// First, create the user
		const user = await api_client.post("/auth/create_user", {
			id: userId,
			username: username,
			hash: password,
		});

		if (user.status === 200) {
			console.log(user)


		// Create session once user is confirmed to exist
		const session = await auth.createSession(
			 user.data.id,
			{},
			{
				sessionId: uuidv4(),
			}
		);

		const sessionCookie = auth.createSessionCookie(session.id);
		//@ts-ignore
		const maxAgeDays = sessionCookie.attributes.maxAge / (24 * 60 * 60);
		Cookies.set(sessionCookie.name, sessionCookie.value, {
			path: "/",
			secure: true,
			sameSite: "strict",
			expires: maxAgeDays,
		});
	}
	} catch (e) {
		console.log(e);
		return Promise.reject("Username already used");
	}

}
export async function logout() {
	Cookies.remove("auth_session");
	window.location.reload();
}

function uuidv4() {
	return crypto.randomUUID();
}
