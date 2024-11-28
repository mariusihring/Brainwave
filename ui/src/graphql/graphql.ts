/* eslint-disable */
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
	  };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	/**
	 * ISO 8601 calendar date without timezone.
	 * Format: %Y-%m-%d
	 *
	 * # Examples
	 *
	 * * `1994-11-13`
	 * * `2000-02-24`
	 */
	NaiveDate: { input: any; output: any };
	/**
	 * ISO 8601 combined date and time without timezone.
	 *
	 * # Examples
	 *
	 * * `2015-07-01T08:59:60.123`,
	 */
	NaiveDateTime: { input: any; output: any };
	/**
	 * ISO 8601 time without timezone.
	 * Allows for the nanosecond precision and optional leap second representation.
	 * Format: %H:%M:%S%.f
	 *
	 * # Examples
	 *
	 * * `08:59:60.123`
	 */
	NaiveTime: { input: any; output: any };
	/**
	 * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
	 * Strings within GraphQL. UUIDs are used to assign unique identifiers to
	 * entities without requiring a central allocating authority.
	 *
	 * # References
	 *
	 * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
	 * * [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
	 */
	UUID: { input: any; output: any };
};

export type NewCourse = {
	academicDepartment?: InputMaybe<Scalars["String"]["input"]>;
	grade?: InputMaybe<Scalars["Float"]["input"]>;
	name: Scalars["String"]["input"];
	teacher?: InputMaybe<Scalars["String"]["input"]>;
};

export type NewModule = {
	ects: Scalars["Int"]["input"];
	endSemester?: InputMaybe<Scalars["String"]["input"]>;
	grade?: InputMaybe<Scalars["Float"]["input"]>;
	name: Scalars["String"]["input"];
	startSemester: Scalars["String"]["input"];
};

export type NewSemester = {
	endDate: Scalars["NaiveDate"]["input"];
	semester: Scalars["Int"]["input"];
	startDate: Scalars["NaiveDate"]["input"];
	totalEcts: Scalars["Int"]["input"];
};

export type NewTodo = {
	courseId?: InputMaybe<Scalars["UUID"]["input"]>;
	dueOn: Scalars["NaiveDateTime"]["input"];
	notes?: InputMaybe<Scalars["String"]["input"]>;
	title: Scalars["String"]["input"];
};

export enum TodoStatus {
	Completed = "COMPLETED",
	Inprogress = "INPROGRESS",
	Pending = "PENDING",
}

export enum TodoType {
	Assignment = "ASSIGNMENT",
	Exam = "EXAM",
	General = "GENERAL",
}

export type UpdateTodo = {
	courseId?: InputMaybe<Scalars["UUID"]["input"]>;
	dueOn: Scalars["NaiveDateTime"]["input"];
	id: Scalars["UUID"]["input"];
	notes?: InputMaybe<Scalars["String"]["input"]>;
	title: Scalars["String"]["input"];
};

export enum WeekdayEnum {
	Friday = "FRIDAY",
	Monday = "MONDAY",
	Saturday = "SATURDAY",
	Sunday = "SUNDAY",
	Thursday = "THURSDAY",
	Tuesday = "TUESDAY",
	Wednesday = "WEDNESDAY",
}

export type GetCalendarLinkQueryVariables = Exact<{ [key: string]: never }>;

export type GetCalendarLinkQuery = {
	__typename?: "Query";
	calendarLink?: string | null;
};

export type SaveCalendarLinkMutationVariables = Exact<{
	link: Scalars["String"]["input"];
}>;

export type SaveCalendarLinkMutation = {
	__typename?: "Mutation";
	upsertCalendarLink: { __typename?: "Settings"; id: any };
};

export type CreateSemesterMutationVariables = Exact<{
	input: NewSemester;
}>;

export type CreateSemesterMutation = {
	__typename?: "Mutation";
	createSemester: { __typename?: "Semester"; id: any };
};

export type GetCoursesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCoursesQuery = {
	__typename?: "Query";
	courses: Array<{
		__typename?: "Course";
		id: any;
		name: string;
		grade?: number | null;
		teacher?: string | null;
		academicDepartment?: string | null;
	}>;
};

export type ProcessCalendarMutationVariables = Exact<{
	input: Scalars["String"]["input"];
}>;

export type ProcessCalendarMutation = {
	__typename?: "Mutation";
	processSemesterCalendar: Array<{
		__typename?: "RecurringAppointment";
		name: string;
		weekday: WeekdayEnum;
		startTime: any;
		endTime: any;
		location: string;
	}>;
};

export type CreateCoursesMutationVariables = Exact<{
	input: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type CreateCoursesMutation = {
	__typename?: "Mutation";
	createMultipleCourses: Array<{
		__typename?: "Course";
		academicDepartment?: string | null;
		grade?: number | null;
		id: any;
		name: string;
		teacher?: string | null;
	}>;
};

export type CreateSemesterMutationMutationVariables = Exact<{
	input: NewSemester;
}>;

export type CreateSemesterMutationMutation = {
	__typename?: "Mutation";
	createSemester: { __typename?: "Semester"; id: any; semester: number };
};

export type CreateModuleMutationVariables = Exact<{
	input: NewModule;
}>;

export type CreateModuleMutation = {
	__typename?: "Mutation";
	createModule: { __typename?: "Module"; id: any; etCs: number; name: string };
};

export type CreateTodoMutationMutationVariables = Exact<{
	input: NewTodo;
}>;

export type CreateTodoMutationMutation = {
	__typename?: "Mutation";
	createTodo: { __typename?: "Todo"; id: any };
};

export type TodoIndexQueryQueryVariables = Exact<{ [key: string]: never }>;

export type TodoIndexQueryQuery = {
	__typename?: "Query";
	todos: Array<{
		__typename?: "Todo";
		id: any;
		title: string;
		dueOn: any;
		userId: any;
	}>;
};

export type UpdateTodoStatusMutationMutationVariables = Exact<{
	id: Scalars["String"]["input"];
	input: UpdateTodo;
}>;

export type UpdateTodoStatusMutationMutation = {
	__typename?: "Mutation";
	updateTodo: {
		__typename?: "Todo";
		id: any;
		title: string;
		dueOn: any;
		userId: any;
	};
};

export type AppointmentQueryQueryVariables = Exact<{ [key: string]: never }>;

export type AppointmentQueryQuery = {
	__typename?: "Query";
	appointments: Array<{
		__typename?: "Appointment";
		id: any;
		date: any;
		endTime: any;
		startTime: any;
		location?: string | null;
	}>;
};

export type TodoDashboardQueryQueryVariables = Exact<{ [key: string]: never }>;

export type TodoDashboardQueryQuery = {
	__typename?: "Query";
	todos: Array<{ __typename?: "Todo"; id: any; title: string; dueOn: any }>;
};

export type GetAllSemesterQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllSemesterQuery = {
	__typename?: "Query";
	semesters: Array<{
		__typename?: "Semester";
		id: any;
		semester: number;
		endDate: any;
		totalEcTs: number;
		startDate: any;
		modules: Array<{
			__typename?: "Module";
			id: any;
			name: string;
			etCs: number;
			grade?: number | null;
			startSemester: any;
			endSemester?: any | null;
		}>;
		courses: Array<{
			__typename?: "Course";
			id: any;
			name: string;
			grade?: number | null;
			teacher?: string | null;
			academicDepartment?: string | null;
		}>;
	}>;
};

export class TypedDocumentString<TResult, TVariables>
	extends String
	implements DocumentTypeDecoration<TResult, TVariables>
{
	__apiType?: DocumentTypeDecoration<TResult, TVariables>["__apiType"];

	constructor(
		private value: string,
		public __meta__?: Record<string, any>,
	) {
		super(value);
	}

	toString(): string & DocumentTypeDecoration<TResult, TVariables> {
		return this.value;
	}
}

export const GetCalendarLinkDocument = new TypedDocumentString(`
    query getCalendarLink {
  calendarLink
}
    `) as unknown as TypedDocumentString<
	GetCalendarLinkQuery,
	GetCalendarLinkQueryVariables
>;
export const SaveCalendarLinkDocument = new TypedDocumentString(`
    mutation SaveCalendarLink($link: String!) {
  upsertCalendarLink(calendarLink: $link) {
    id
  }
}
    `) as unknown as TypedDocumentString<
	SaveCalendarLinkMutation,
	SaveCalendarLinkMutationVariables
>;
export const CreateSemesterDocument = new TypedDocumentString(`
    mutation createSemester($input: NewSemester!) {
  createSemester(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
	CreateSemesterMutation,
	CreateSemesterMutationVariables
>;
export const GetCoursesDocument = new TypedDocumentString(`
    query getCourses {
  courses {
    id
    name
    grade
    teacher
    academicDepartment
  }
}
    `) as unknown as TypedDocumentString<
	GetCoursesQuery,
	GetCoursesQueryVariables
>;
export const ProcessCalendarDocument = new TypedDocumentString(`
    mutation ProcessCalendar($input: String!) {
  processSemesterCalendar(semesterId: $input) {
    name
    weekday
    startTime
    endTime
    location
  }
}
    `) as unknown as TypedDocumentString<
	ProcessCalendarMutation,
	ProcessCalendarMutationVariables
>;
export const CreateCoursesDocument = new TypedDocumentString(`
    mutation createCourses($input: [String!]!) {
  createMultipleCourses(input: $input) {
    academicDepartment
    grade
    id
    name
    teacher
  }
}
    `) as unknown as TypedDocumentString<
	CreateCoursesMutation,
	CreateCoursesMutationVariables
>;
export const CreateSemesterMutationDocument = new TypedDocumentString(`
    mutation createSemesterMutation($input: NewSemester!) {
  createSemester(input: $input) {
    id
    semester
  }
}
    `) as unknown as TypedDocumentString<
	CreateSemesterMutationMutation,
	CreateSemesterMutationMutationVariables
>;
export const CreateModuleDocument = new TypedDocumentString(`
    mutation CreateModule($input: NewModule!) {
  createModule(input: $input) {
    id
    etCs
    name
  }
}
    `) as unknown as TypedDocumentString<
	CreateModuleMutation,
	CreateModuleMutationVariables
>;
export const CreateTodoMutationDocument = new TypedDocumentString(`
    mutation createTodoMutation($input: NewTodo!) {
  createTodo(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
	CreateTodoMutationMutation,
	CreateTodoMutationMutationVariables
>;
export const TodoIndexQueryDocument = new TypedDocumentString(`
    query TodoIndexQuery {
  todos {
    id
    title
    dueOn
    userId
  }
}
    `) as unknown as TypedDocumentString<
	TodoIndexQueryQuery,
	TodoIndexQueryQueryVariables
>;
export const UpdateTodoStatusMutationDocument = new TypedDocumentString(`
    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {
  updateTodo(id: $id, input: $input) {
    id
    title
    dueOn
    userId
  }
}
    `) as unknown as TypedDocumentString<
	UpdateTodoStatusMutationMutation,
	UpdateTodoStatusMutationMutationVariables
>;
export const AppointmentQueryDocument = new TypedDocumentString(`
    query AppointmentQuery {
  appointments {
    id
    date
    endTime
    startTime
    location
  }
}
    `) as unknown as TypedDocumentString<
	AppointmentQueryQuery,
	AppointmentQueryQueryVariables
>;
export const TodoDashboardQueryDocument = new TypedDocumentString(`
    query TodoDashboardQuery {
  todos {
    id
    title
    dueOn
  }
}
    `) as unknown as TypedDocumentString<
	TodoDashboardQueryQuery,
	TodoDashboardQueryQueryVariables
>;
export const GetAllSemesterDocument = new TypedDocumentString(`
    query getAllSemester {
  semesters {
    id
    semester
    endDate
    totalEcTs
    modules {
      id
      name
      etCs
      grade
      startSemester
      endSemester
    }
    courses {
      id
      name
      grade
      teacher
      academicDepartment
    }
    startDate
  }
}
    `) as unknown as TypedDocumentString<
	GetAllSemesterQuery,
	GetAllSemesterQueryVariables
>;
