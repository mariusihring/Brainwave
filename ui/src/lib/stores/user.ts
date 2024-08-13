import type { User } from "lucia";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
	user: User | null;
};

type Actions = {
	setUser: (user: User | null) => void;
};

export const useUser = create<State & Actions>()(
	immer((set) => ({
		user: null,
		setUser: (user: User | null) =>
			set((state) => {
				state.user = user;
			}),
	})),
);
