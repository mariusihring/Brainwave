import type { DatabaseSession, DatabaseUser, UserId } from "lucia";
import api_client from "../axios_client";

interface Adapter {
	deleteExpiredSessions(): Promise<void>;
	deleteSession(sessionId: string): Promise<void>;
	deleteUserSessions(userId: UserId): Promise<void>;
	getSessionAndUser(
		sessionId: string,
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]>;
	getUserSessions(userId: UserId): Promise<DatabaseSession[]>;
	setSession(session: DatabaseSession): Promise<void>;
	updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void>;
}

export const brainwave_adapter: Adapter = {
	deleteExpiredSessions: async (): Promise<void> =>
		await api_client.post("/auth/delete_sessions"),
	deleteSession: async (sessionId: string): Promise<void> =>
		await api_client.post(`/auth/delete_session/${sessionId}`),
	deleteUserSessions: async (userId: string): Promise<void> =>
		await api_client.post(`/auth/delete_user_session/${userId}`),
	getSessionAndUser: async (
		sessionId: string,
	): Promise<[session: DatabaseSession, user: DatabaseUser]> =>
		await api_client.post(`/auth/get_user_and_session/${sessionId}`),
	getUserSessions: async (userId: string): Promise<DatabaseSession[]> =>
		await api_client.post(`/auth/get_user_sessions/${userId}`),
	setSession: async (session: DatabaseSession): Promise<void> =>
		await api_client.post("/auth/set_session", {
			id: session.id,
			user_id: session.userId,
			expires_at: session.expiresAt,
			attributes: session.attributes,
		}),
	updateSessionExpiration: async (
		sessionId: string,
		expiresAt: Date,
	): Promise<void> =>
		await api_client.post("/auth/update_session", {
			session_id: sessionId,
			expires_at: expiresAt,
		}),
};
