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
	deleteExpiredSessions: async (): Promise<void> => {
		(await api_client.post("/auth/delete_sessions")).data;
	},
	deleteSession: async (sessionId: string): Promise<void> => {
		(await api_client.post(`/auth/delete_session/${sessionId}`)).data;
	},
	deleteUserSessions: async (userId: string): Promise<void> =>
		await api_client.post(`/auth/delete_user_session/${userId}`),
	getSessionAndUser: async (
		sessionId: string,
	): Promise<[session: DatabaseSession, user: DatabaseUser]> => {
		const response = await api_client.post<
			[session: DatabaseSession, user: DatabaseUser]
		>(`/auth/get_user_and_session/${sessionId}`);
		if (response.data[0] === null || response.data[1] === null ) {
			Promise.reject()
		}
		const session: DatabaseSession = {
			userId: response.data[0].userId,
			expiresAt: new Date(response.data[0].expiresAt),
			id: response.data[0].id,
			attributes: response.data[0].attributes,
		};
		const user: DatabaseUser = {
			id: response.data[1].id,
			attributes: response.data[1].attributes,
		};
		return [session, user];
	},
	getUserSessions: async (userId: string): Promise<DatabaseSession[]> => {
		return (await api_client.post(`/auth/get_user_sessions/${userId}`)).data;
	},
	setSession: async (session: DatabaseSession): Promise<void> => {
		return await (
			await api_client.post("/auth/set_session", {
				id: session.id,
				userId: session.userId,
				expiresAt: session.expiresAt,
				attributes: session.attributes,
			})
		).data;
	},
	updateSessionExpiration: async (
		sessionId: string,
		expiresAt: Date,
	): Promise<void> =>
		await api_client.post("/auth/update_session", {
			session_id: sessionId,
			expires_at: expiresAt,
		}),
};
