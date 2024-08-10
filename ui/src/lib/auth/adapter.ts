import {DatabaseSession, DatabaseUser, UserId } from "lucia";

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

export const adapter: Adapter = {
    deleteExpiredSessions: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    deleteSession: function (sessionId: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    deleteUserSessions: function (userId: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getSessionAndUser: function (sessionId: string): Promise<[session: DatabaseSession, user: DatabaseUser]> {
        throw new Error("Function not implemented.");
    },
    getUserSessions: function (userId: string): Promise<DatabaseSession[]> {
        throw new Error("Function not implemented.");
    },
    setSession: function (session: DatabaseSession): Promise<void> {
        throw new Error("Function not implemented.");
    },
    updateSessionExpiration: function (sessionId: string, expiresAt: Date): Promise<void> {
        throw new Error("Function not implemented.");
    }
} 
