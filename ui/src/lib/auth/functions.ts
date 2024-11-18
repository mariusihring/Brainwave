import { auth } from "@/auth";
import Cookies from "js-cookie";
import { type DatabaseUser, generateIdFromEntropySize } from "lucia";
import api_client from "../axios_client";
import bcrypt from "bcryptjs"

export async function login(username: string, password: string) {
  const existingUser = (
    await api_client.post("/auth/get_user", {
      username: username,
    })
  ).data as DatabaseUser | undefined;
  if (!existingUser) {
    return Promise.reject("Username invalid");
  }
  const pw = await bcrypt.compare(password, existingUser.attributes.password_hash)
  if (!pw) {
    return Promise.reject("Password invalid");
  }
  const session = await auth.createSession(existingUser.id, {}, {
    sessionId: uuidv4()
  });
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

    const session = await auth.createSession(userId, {}, {
      sessionId: uuidv4()
    });
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
export async function logout() {
  Cookies.remove("auth_session")
  window.location.reload()
}


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
