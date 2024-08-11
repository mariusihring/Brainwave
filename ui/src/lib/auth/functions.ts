import { auth } from "@/auth";
import { redirect } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { type DatabaseUser, generateIdFromEntropySize } from "lucia";
import api_client from "../axios_client";

export async function login(username: string, password: string) {
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username",
		};
	}
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return {
			error: "Invalid password",
		};
	}

	const existingUser = (await api_client.get("/auth/get_user", {
		params: {
			username: username,
		},
	})) as DatabaseUser | undefined;
	if (!existingUser) {
		return "allready a user with this name";
	}
	const pw = existingUser.attributes.password_hash === password;
	if (!pw) {
		return "wrong password";
	}
	const session = await auth.createSession(existingUser.id, {});
	const sessionCookie = auth.createSessionCookie(session.id);
	// Cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	Cookies.set("name", "value", { domain: "your-domain.com", path: "/" });
	return redirect({ to: "/" });
}
export async function signup(username: string, password: string) {
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username",
		};
	}
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return {
			error: "Invalid password",
		};
	}
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
			secure: true, // if using HTTPS
			sameSite: "strict",
			expires: maxAgeDays,
		});
	} catch (e) {
		return Promise.reject("Username allready used");
	}
}
