import { auth } from "@/auth";
import { DatabaseUser, generateIdFromEntropySize } from "lucia";
import Cookies from "js-cookie"
import { redirect } from "@tanstack/react-router"
import api_client from "../axios_client";

export async function login(username: string, password: string) {


    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return {
            error: "Invalid username"
        };
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }

    const existingUser = await api_client.get("/auth/get_user", {
        params: {
            username: username
        }
    }) as
        | DatabaseUser
        | undefined;
    if (!existingUser) {
        return "allready a user with this name"
    }
    const validPassword = await Bun.password.verify(password, existingUser.attributes.password_hash);
    if (!validPassword) {
        return "wrong password"
    }
    const session = await auth.createSession(existingUser.id, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    Cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
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
            error: "Invalid username"
        };
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }
    const passwordHash = await Bun.password.hash(password);
    const userId = generateIdFromEntropySize(10);
    try {
        await api_client.post("/auth/create_user", {
            id: userId,
            username: username,
            hash: passwordHash
        })
         

        const session = await auth.createSession(userId, {});
        const sessionCookie = auth.createSessionCookie(session.id)
        Cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return redirect({ to: "/" });
    } catch (e) {
        return "Username already used"

    }

}

