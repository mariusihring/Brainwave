import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {Course, Module} from "@/graphql/graphql.ts";

type State = {
    semester: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    modules: Module[];
    courses: Course[];
    calendarLink: string;
    useExistingLink: boolean;
    activeStep: number,
    steps: { id: string, title: string }[]
    maxUsedStep: number

};

type Actions = {
    nextStep: () => void
    lastStep: () => void
    addModule: (x: Module) => void
    removeModule: (x: Module) => void
    updateModule: (index: number, x: Module) => void
    addCourse: (x: Course) => void
    removeCourse: (x: Course) => void
    updateCourse: (index: number, x: Course) => void
    setSemester: (x: number) => void
    setStartDate: (x: Date | undefined) => void
    setEndDate: (x: Date | undefined) => void
    setUseExistingLink: (x: boolean) => void
    setCalendarLink: (x: string) => void
    addModuleCourse: (moduleId: string, x: Course, index: number) => void
    removeModuleCourse: (moduleId: string, index: number) => void
    reorderModuleCourses: (moduleId: string, startIndex: number, endIndex: number) => void

};

export const useSemesterStepper = create<State & Actions>()(
    immer((set) => ({
        semester: 1,
        startDate: undefined,
        endDate: undefined,
        modules: [],
        courses: [{
            id: (Math.random() + 1).toString(36).substring(7),
            name: "first"
        }, {
            id: (Math.random() + 1).toString(36).substring(7),
            name: "second"
        }, {
            id: (Math.random() + 1).toString(36).substring(7),
            name: "third"
        }],
        calendarLink: '',
        useExistingLink: false,
        activeStep: 0,
        maxUsedStep: 0,
        steps: [
            {id: 'semester', title: 'Semester'},
            {id: 'modules', title: 'Modules'},
            {id: 'calendar', title: 'Calendar'},
            {id: 'courses', title: 'Courses'},
            {id: 'review', title: 'Review'},
        ],
        setSemester: (x: number) => set((state) => {
            state.semester = x
        }),
        nextStep: () =>
            set((state) => {
                state.maxUsedStep = state.maxUsedStep + 1
                state.activeStep += 1
            }),
        lastStep: () => set((state) => {
            state.activeStep -= 1
        }),
        addModule: (x: Module) => set((state) => {
            state.modules.push(x)
        }),
        removeModule: (x: Module) => set((state) => {
            state.modules.splice(state.modules.indexOf(x), 1)
        }),
        updateModule: (index: number, x: Module) => set((state) => {
            state.modules[index] = x
        }),
        addCourse: (x: Course) => set((state) => {
            state.courses.push(x)
        }),
        removeCourse: (x: Course) => set((state) => {
            state.courses.splice(state.courses.indexOf(x), 1)
        }),
        updateCourse: (index: number, x: Course) => set((state) => {
            state.courses[index] = x
        }),
        setStartDate: (x: Date | undefined) => set((state) => {
            state.startDate = x
        }),
        setEndDate: (x: Date | undefined) => set((state) => {
            state.endDate = x
        }),
        setUseExistingLink: (x: boolean) => set((state) => {
            state.useExistingLink = x
        }),
        setCalendarLink: (x: string) => set((state) => {
            state.calendarLink = x
        }),
        addModuleCourse: (moduleId: string, x: Course, index: number) => set((state) => {
            state.modules.find(m => m.id === moduleId)?.courses.splice(index, 0, x)
        }),
        removeModuleCourse: (moduleId: string, index: number) => set((state) => {
            state.modules.find(m => m.id === moduleId)?.courses.splice(index, 1)
        }),
        reorderModuleCourses: (moduleId: string, startIndex: number, endIndex: number) =>
            set(state => {
                const moduleIndex = state.modules.findIndex(m => m.id === moduleId);
                if (moduleIndex !== -1) {
                    const [removed] = state.modules[moduleIndex].courses.splice(startIndex, 1);
                    state.modules[moduleIndex].courses.splice(endIndex, 0, removed);
                }
            }),
    }))
);
