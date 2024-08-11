import {DatabaseSession, DatabaseUser, UserId } from "lucia";
import api_client from "../axios_client";


interface Adapter {
	deleteExpiredSessions(): Promise<void>;
	deleteSession(sessionId: string): Promise<void>;
	deleteUserSessions(userId: UserId): Promise<void>;
	getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]>;
	getUserSessions(userId: UserId): Promise<DatabaseSession[]>;
	setSession(session: DatabaseSession): Promise<void>;
	updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void>;
}

export const brainwave_adapter: Adapter = {
    deleteExpiredSessions: async function (): Promise<void> {
        return await api_client.post("/auth/delete_sessions")
    },
    deleteSession: async function (sessionId: string): Promise<void> {
        return await api_client.post(`/delete_session/${sessionId}`)
    },
    deleteUserSessions: async function (userId: string): Promise<void> {
        return await api_client.post(`/delete_user_session/${userId}`)
    },
    getSessionAndUser: async function (sessionId: string): Promise<[session: DatabaseSession, user: DatabaseUser]> {
        return await api_client.post(`/get_user_and_session/${sessionId}`)
    },
    getUserSessions: async function (userId: string): Promise<DatabaseSession[]> {
        return await api_client.post(`/get_user_sessions/${userId}`)
    },
    setSession: async function (session: DatabaseSession): Promise<void> {
        return await api_client.post(`/set_session`, {
            id: session.id,
            user_id: session.userId,
            expires_at:session.expiresAt,
            attributes: session.attributes, 
        })
    },
    updateSessionExpiration: async function (sessionId: string, expiresAt: Date): Promise<void> {
        return await api_client.post(`/update_session`, {
            session_id: sessionId,
            expires_at: expiresAt
        })
    }
} 
