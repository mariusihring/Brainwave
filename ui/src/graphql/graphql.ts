/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * ISO 8601 calendar date without timezone.
   * Format: %Y-%m-%d
   *
   * # Examples
   *
   * * `1994-11-13`
   * * `2000-02-24`
   */
  NaiveDate: { input: any; output: any; }
  /**
   * ISO 8601 combined date and time without timezone.
   *
   * # Examples
   *
   * * `2015-07-01T08:59:60.123`,
   */
  NaiveDateTime: { input: any; output: any; }
  /**
   * ISO 8601 time without timezone.
   * Allows for the nanosecond precision and optional leap second representation.
   * Format: %H:%M:%S%.f
   *
   * # Examples
   *
   * * `08:59:60.123`
   */
  NaiveTime: { input: any; output: any; }
};

export type Appointment = {
  __typename?: 'Appointment';
  date: Scalars['NaiveDate']['output'];
  endTime: Scalars['NaiveDateTime']['output'];
  id: Scalars['String']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startTime: Scalars['NaiveDateTime']['output'];
};

export type Course = {
  __typename?: 'Course';
  academicDepartment?: Maybe<Scalars['String']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  teacher?: Maybe<Scalars['String']['output']>;
};

export type Module = {
  __typename?: 'Module';
  courses?: Maybe<Array<Course>>;
  ects: Scalars['Int']['output'];
  endSemester?: Maybe<Scalars['String']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startSemester: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCourse: Course;
  createModule: Module;
  createMultipleCourses: Array<Course>;
  createSemester: Semester;
  createTodo: Todo;
  processSemesterCalendar: Array<RecurringAppointment>;
  updateTodo: Todo;
  upsertCalendarLink: Settings;
};


export type MutationCreateCourseArgs = {
  input: NewCourse;
};


export type MutationCreateModuleArgs = {
  input: NewModule;
};


export type MutationCreateMultipleCoursesArgs = {
  input: Array<Scalars['String']['input']>;
};


export type MutationCreateSemesterArgs = {
  input: NewSemester;
};


export type MutationCreateTodoArgs = {
  input: NewTodo;
};


export type MutationProcessSemesterCalendarArgs = {
  semesterId: Scalars['String']['input'];
};


export type MutationUpdateTodoArgs = {
  id: Scalars['String']['input'];
  input: UpdateTodo;
};


export type MutationUpsertCalendarLinkArgs = {
  calendarLink?: InputMaybe<Scalars['String']['input']>;
};

export type NewCourse = {
  academicDepartment?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  teacher?: InputMaybe<Scalars['String']['input']>;
};

export type NewModule = {
  ects: Scalars['Int']['input'];
  endSemester?: InputMaybe<Scalars['String']['input']>;
  grade?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  startSemester: Scalars['String']['input'];
};

export type NewSemester = {
  endDate: Scalars['NaiveDate']['input'];
  semester: Scalars['Int']['input'];
  startDate: Scalars['NaiveDate']['input'];
  totalEcts: Scalars['Int']['input'];
};

export type NewTodo = {
  courseId?: InputMaybe<Scalars['String']['input']>;
  dueOn: Scalars['NaiveDateTime']['input'];
  title: Scalars['String']['input'];
  todoType?: InputMaybe<TodoType>;
};

export type Query = {
  __typename?: 'Query';
  appointments: Array<Appointment>;
  calendarLink?: Maybe<Scalars['String']['output']>;
  course: Course;
  courses: Array<Course>;
  module: Module;
  modules: Array<Module>;
  semester: Semester;
  semesters: Array<Semester>;
  todo: Todo;
  todos: Array<Todo>;
  todosByDate: Array<Todo>;
};


export type QueryCourseArgs = {
  id: Scalars['String']['input'];
};


export type QueryModuleArgs = {
  id: Scalars['String']['input'];
};


export type QuerySemesterArgs = {
  semester: Scalars['Int']['input'];
};


export type QueryTodoArgs = {
  id: Scalars['String']['input'];
};


export type QueryTodosByDateArgs = {
  date: Scalars['NaiveDate']['input'];
};

export type RecurringAppointment = {
  __typename?: 'RecurringAppointment';
  endTime: Scalars['NaiveTime']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startTime: Scalars['NaiveTime']['output'];
  weekday: WeekdayEnum;
};

export type Semester = {
  __typename?: 'Semester';
  courses: Array<Course>;
  endDate: Scalars['NaiveDate']['output'];
  id: Scalars['String']['output'];
  importedAppointments: Scalars['Boolean']['output'];
  modules: Array<Module>;
  semester: Scalars['Int']['output'];
  startDate: Scalars['NaiveDate']['output'];
  totalEcts: Scalars['Int']['output'];
};

export type Settings = {
  __typename?: 'Settings';
  calendarLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Todo = {
  __typename?: 'Todo';
  course?: Maybe<Course>;
  dueOn: Scalars['NaiveDateTime']['output'];
  id: Scalars['String']['output'];
  status: TodoStatus;
  title: Scalars['String']['output'];
  todoType: TodoType;
  userId: Scalars['String']['output'];
};

export enum TodoStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export enum TodoType {
  Assignment = 'ASSIGNMENT',
  Exam = 'EXAM',
  General = 'GENERAL'
}

export type UpdateTodo = {
  courseId?: InputMaybe<Scalars['String']['input']>;
  dueOn: Scalars['NaiveDateTime']['input'];
  status: TodoStatus;
  title: Scalars['String']['input'];
  todoType?: InputMaybe<TodoType>;
};

export enum WeekdayEnum {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type GetCalendarLinkQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCalendarLinkQuery = { __typename?: 'Query', calendarLink?: string | null };

export type SaveCalendarLinkMutationVariables = Exact<{
  link: Scalars['String']['input'];
}>;


export type SaveCalendarLinkMutation = { __typename?: 'Mutation', upsertCalendarLink: { __typename?: 'Settings', id: string } };

export type CreateSemesterMutationVariables = Exact<{
  input: NewSemester;
}>;


export type CreateSemesterMutation = { __typename?: 'Mutation', createSemester: { __typename?: 'Semester', id: string } };

export type GetCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, name: string, grade?: number | null, teacher?: string | null, academicDepartment?: string | null }> };

export type ProcessCalendarMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type ProcessCalendarMutation = { __typename?: 'Mutation', processSemesterCalendar: Array<{ __typename?: 'RecurringAppointment', name: string, weekday: WeekdayEnum, startTime: any, endTime: any, location: string }> };

export type CreateCoursesMutationVariables = Exact<{
  input: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CreateCoursesMutation = { __typename?: 'Mutation', createMultipleCourses: Array<{ __typename?: 'Course', academicDepartment?: string | null, grade?: number | null, id: string, name: string, teacher?: string | null }> };

export type CreateSemesterMutationMutationVariables = Exact<{
  input: NewSemester;
}>;


export type CreateSemesterMutationMutation = { __typename?: 'Mutation', createSemester: { __typename?: 'Semester', id: string, semester: number } };

export type CreateModuleMutationVariables = Exact<{
  input: NewModule;
}>;


export type CreateModuleMutation = { __typename?: 'Mutation', createModule: { __typename?: 'Module', id: string, ects: number, name: string } };

export type CreateTodoMutationMutationVariables = Exact<{
  input: NewTodo;
}>;


export type CreateTodoMutationMutation = { __typename?: 'Mutation', createTodo: { __typename?: 'Todo', id: string } };

export type TodoIndexQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type TodoIndexQueryQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'Todo', id: string, title: string, dueOn: any, userId: string, todoType: TodoType, status: TodoStatus, course?: { __typename?: 'Course', id: string, name: string, grade?: number | null, teacher?: string | null, academicDepartment?: string | null } | null }> };

export type UpdateTodoStatusMutationMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateTodo;
}>;


export type UpdateTodoStatusMutationMutation = { __typename?: 'Mutation', updateTodo: { __typename?: 'Todo', id: string, title: string, dueOn: any, userId: string, todoType: TodoType, status: TodoStatus, course?: { __typename?: 'Course', id: string, name: string, grade?: number | null, teacher?: string | null, academicDepartment?: string | null } | null } };

export type AppointmentQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type AppointmentQueryQuery = { __typename?: 'Query', appointments: Array<{ __typename?: 'Appointment', id: string, date: any, endTime: any, startTime: any, location: string, name: string }> };

export type TodoDashboardQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type TodoDashboardQueryQuery = { __typename?: 'Query', todos: Array<{ __typename?: 'Todo', id: string, title: string, dueOn: any, todoType: TodoType }> };

export type GetAllSemesterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSemesterQuery = { __typename?: 'Query', semesters: Array<{ __typename?: 'Semester', id: string, semester: number, endDate: any, totalEcts: number, startDate: any, modules: Array<{ __typename?: 'Module', id: string, name: string, ects: number, grade?: number | null, startSemester: string, endSemester?: string | null }>, courses: Array<{ __typename?: 'Course', id: string, name: string, grade?: number | null, teacher?: string | null, academicDepartment?: string | null }> }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any>) {
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
    `) as unknown as TypedDocumentString<GetCalendarLinkQuery, GetCalendarLinkQueryVariables>;
export const SaveCalendarLinkDocument = new TypedDocumentString(`
    mutation SaveCalendarLink($link: String!) {
  upsertCalendarLink(calendarLink: $link) {
    id
  }
}
    `) as unknown as TypedDocumentString<SaveCalendarLinkMutation, SaveCalendarLinkMutationVariables>;
export const CreateSemesterDocument = new TypedDocumentString(`
    mutation createSemester($input: NewSemester!) {
  createSemester(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateSemesterMutation, CreateSemesterMutationVariables>;
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
    `) as unknown as TypedDocumentString<GetCoursesQuery, GetCoursesQueryVariables>;
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
    `) as unknown as TypedDocumentString<ProcessCalendarMutation, ProcessCalendarMutationVariables>;
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
    `) as unknown as TypedDocumentString<CreateCoursesMutation, CreateCoursesMutationVariables>;
export const CreateSemesterMutationDocument = new TypedDocumentString(`
    mutation createSemesterMutation($input: NewSemester!) {
  createSemester(input: $input) {
    id
    semester
  }
}
    `) as unknown as TypedDocumentString<CreateSemesterMutationMutation, CreateSemesterMutationMutationVariables>;
export const CreateModuleDocument = new TypedDocumentString(`
    mutation CreateModule($input: NewModule!) {
  createModule(input: $input) {
    id
    ects
    name
  }
}
    `) as unknown as TypedDocumentString<CreateModuleMutation, CreateModuleMutationVariables>;
export const CreateTodoMutationDocument = new TypedDocumentString(`
    mutation createTodoMutation($input: NewTodo!) {
  createTodo(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateTodoMutationMutation, CreateTodoMutationMutationVariables>;
export const TodoIndexQueryDocument = new TypedDocumentString(`
    query TodoIndexQuery {
  todos {
    id
    title
    dueOn
    userId
    todoType
    status
    course {
      id
      name
      grade
      teacher
      academicDepartment
    }
  }
}
    `) as unknown as TypedDocumentString<TodoIndexQueryQuery, TodoIndexQueryQueryVariables>;
export const UpdateTodoStatusMutationDocument = new TypedDocumentString(`
    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {
  updateTodo(id: $id, input: $input) {
    id
    title
    dueOn
    userId
    todoType
    status
    course {
      id
      name
      grade
      teacher
      academicDepartment
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateTodoStatusMutationMutation, UpdateTodoStatusMutationMutationVariables>;
export const AppointmentQueryDocument = new TypedDocumentString(`
    query AppointmentQuery {
  appointments {
    id
    date
    endTime
    startTime
    location
    name
  }
}
    `) as unknown as TypedDocumentString<AppointmentQueryQuery, AppointmentQueryQueryVariables>;
export const TodoDashboardQueryDocument = new TypedDocumentString(`
    query TodoDashboardQuery {
  todos {
    id
    title
    dueOn
    todoType
  }
}
    `) as unknown as TypedDocumentString<TodoDashboardQueryQuery, TodoDashboardQueryQueryVariables>;
export const GetAllSemesterDocument = new TypedDocumentString(`
    query getAllSemester {
  semesters {
    id
    semester
    endDate
    totalEcts
    modules {
      id
      name
      ects
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
    `) as unknown as TypedDocumentString<GetAllSemesterQuery, GetAllSemesterQueryVariables>;