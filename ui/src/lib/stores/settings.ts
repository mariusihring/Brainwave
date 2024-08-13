import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SettingsState = {
	nav_open: boolean;
};

type SettingsActions = {
	setNav: (new_state: boolean) => void;
};

export const useSettings = create<SettingsState & SettingsActions>()(
	persist(
		immer((set) => ({
			nav_open: false,
			setNav: (new_state) => {
				set((state) => {
					state.nav_open = new_state;
				});
			},
		})),
		{
			name: "brainwave-settings",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
