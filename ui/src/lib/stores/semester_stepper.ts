import type {
	Course,
	Module,
	RecurringAppointment,
} from "@/graphql/graphql.ts";
import type { Semester } from "@/graphql/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
	semester: number | undefined;
	created_semester_id: string | undefined;
	startDate: Date | undefined;
	endDate: Date | undefined;
	modules: Module[];
	courses: Course[];
	calendarLink: string;
	useExistingLink: boolean;
	activeStep: number;
	steps: { id: string; title: string }[];
	maxUsedStep: number;
	availableCourses: RecurringAppointment[];
	//stuff for the module creation
	semesters: Semester[];
};

type Actions = {
	setCreatedSemesterId: (x: string) => void;
	nextStep: () => void;
	lastStep: () => void;
	addModule: (x: Module) => void;
	removeModule: (x: Module) => void;
	updateModule: (x: Module) => void;
	addAllCourses: (x: Course[]) => void;
	addCourse: (x: Course) => void;
	removeCourse: (x: Course) => void;
	updateCourse: (index: number, field: string, x: Course) => void;
	setSemester: (x: number) => void;
	setStartDate: (x: Date | undefined) => void;
	setEndDate: (x: Date | undefined) => void;
	setUseExistingLink: (x: boolean) => void;
	setCalendarLink: (x: string) => void;
	addModuleCourse: (moduleId: string, x: Course, index: number) => void;
	removeModuleCourse: (moduleId: string, index: number) => void;
	reorderModuleCourses: (
		moduleId: string,
		startIndex: number,
		endIndex: number,
	) => void;
	setAvailableCourses: (x: RecurringAppointment[]) => void;
	setSemesters: (x: Semester[]) => void;
	addOneSemester: (x: Semester) => void;
	deleteModule: (x: string) => void;
};

export const useSemesterStepper = create<State & Actions>()(
	immer((set) => ({
		semester: undefined,
		availableCourses: [],
		created_semester_id: undefined,
		startDate: undefined,
		endDate: undefined,
		modules: [],
		courses: [],
		calendarLink: "",
		useExistingLink: false,
		activeStep: 0,
		maxUsedStep: 0,
		steps: [
			{ id: "semester", title: "Semester" },
			{ id: "modules", title: "Modules" },
			{ id: "calendar", title: "Calendar" },
			{ id: "courses", title: "Courses" },
			{ id: "review", title: "Review" },
		],
		semesters: [],
		setCreatedSemesterId: (x: string | undefined) =>
			set((state) => {
				state.created_semester_id = x;
			}),
		setSemester: (x: number) =>
			set((state) => {
				state.semester = x;
			}),
		nextStep: () =>
			set((state) => {
				state.maxUsedStep = state.maxUsedStep + 1;
				state.activeStep += 1;
			}),
		lastStep: () =>
			set((state) => {
				state.activeStep -= 1;
			}),
		addModule: (x: Module) =>
			set((state) => {
				state.modules.push(x);
			}),
		removeModule: (x: Module) =>
			set((state) => {
				state.modules.splice(state.modules.indexOf(x), 1);
			}),
		updateModule: (x: Module) =>
			set((state) => {
				state.modules.map((mod) => (mod.id === x ? x : mod));
			}),
		addCourse: (x: Course) =>
			set((state) => {
				state.courses.push(x);
			}),
		removeCourse: (x: Course) =>
			set((state) => {
				state.courses.splice(state.courses.indexOf(x), 1);
			}),
		updateCourse: (index: number, x: Course) =>
			set((state) => {
				state.courses[index] = x;
			}),
		setStartDate: (x: Date | undefined) =>
			set((state) => {
				state.startDate = x;
			}),
		setEndDate: (x: Date | undefined) =>
			set((state) => {
				state.endDate = x;
			}),
		setUseExistingLink: (x: boolean) =>
			set((state) => {
				state.useExistingLink = x;
			}),
		setCalendarLink: (x: string) =>
			set((state) => {
				state.calendarLink = x;
			}),
		addModuleCourse: (moduleId: string, x: Course, index: number) =>
			set((state) => {
				state.modules
					.find((m) => m.id === moduleId)
					?.courses.splice(index, 0, x);
			}),
		removeModuleCourse: (moduleId: string, index: number) =>
			set((state) => {
				state.modules.find((m) => m.id === moduleId)?.courses.splice(index, 1);
			}),
		reorderModuleCourses: (
			moduleId: string,
			startIndex: number,
			endIndex: number,
		) =>
			set((state) => {
				const moduleIndex = state.modules.findIndex((m) => m.id === moduleId);
				if (moduleIndex !== -1) {
					const [removed] = state.modules[moduleIndex].courses.splice(
						startIndex,
						1,
					);
					state.modules[moduleIndex].courses.splice(endIndex, 0, removed);
				}
			}),
		addAllCourses: (x: Course[]) =>
			set((state) => {
				state.courses = x;
			}),
		setAvailableCourses: (x: RecurringAppointment[]) =>
			set((state) => {
				state.availableCourses = x;
			}),
		setSemesters: (x: Semester[]) =>
			set((state) => {
				state.semesters = x;
			}),
		addOneSemester: (x: Semester) =>
			set((state) => {
				state.semesters.push(x);
			}),
		deleteModule: (x: string) =>
			set((state) => state.modules.filter((mod) => mod.id !== x)),
	})),
);
