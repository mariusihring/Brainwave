import * as LucideIcons from "lucide-react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type IconName = keyof typeof LucideIcons;

export type Item = {
	title: string;
	url: string;
	iconName: IconName;
	isActive?: boolean;
	isGroup: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

type NavState = {
	navMain: Item[];
	navSecondary: {
		title: string;
		url: string;
		iconName: IconName;
	}[];
	projects: {
		name: string;
		url: string;
		iconName: IconName;
	}[];
};

type NavActions = {
	getIcon: (iconName: IconName) => React.ComponentType<any> | undefined;
	updateToggleState: (item: Item) => void;
};

const defaultIconName: IconName = "Home";

export const useNavStore = create<NavState & NavActions>()(
	persist(
		immer((set, get) => ({
			navMain: [
				{
					title: "Home",
					url: "/",
					iconName: "Home",
					isGroup: false,
				},
				{
					title: "Calendar",
					url: "/calendar",
					iconName: "Calendar",
					isGroup: false,
				},
				{
					title: "University",
					url: "#",
					iconName: "BookOpen",
					isGroup: true,
					isActive: false,
					items: [
						{
							title: "Semesters",
							url: "/university/semester",
						},
						{
							title: "Modules",
							url: "/university/modules",
						},
						{
							title: "Courses",
							url: "/university/courses",
						},
						{
							title: "Todos",
							url: "/university/todos",
						},
					],
				},
				{
					title: "Notes",
					url: "#",
					iconName: "Pen",
					isGroup: true,
					isActive: false,
					items: [
						{
							title: "Markdown",
							url: "#",
						},
						{
							title: "Latex",
							url: "#",
						},
						{
							title: "Flashcards",
							url: "#",
						},
					],
				},
			],
			navSecondary: [
				{
					title: "Support",
					url: "#",
					iconName: "LifeBuoy",
				},
				{
					title: "Feedback",
					url: "#",
					iconName: "Send",
				},
			],
			projects: [
				{
					name: "Design Engineering",
					url: "#",
					iconName: "Frame",
				},
				{
					name: "Sales & Marketing",
					url: "#",
					iconName: "PieChart",
				},
				{
					name: "Travel",
					url: "#",
					iconName: "Map",
				},
			],
			//@ts-ignore
			getIcon: (iconName) => {
				return LucideIcons[iconName] || LucideIcons[defaultIconName];
			},
			updateToggleState: (item) =>
				set((state) => {
					const found_item = state.navMain.find((i) => i.title === item.title);
					if (found_item && found_item.isGroup) {
						found_item.isActive = !found_item.isActive;
					}
				}),
		})),
		{
			name: "brainwave-nav",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
