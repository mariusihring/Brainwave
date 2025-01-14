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
  UUID: { input: any; output: any; }
};

export type Appointment = {
  __typename?: 'Appointment';
  courseId?: Maybe<Scalars['UUID']['output']>;
  date: Scalars['NaiveDate']['output'];
  endTime: Scalars['NaiveDateTime']['output'];
  id: Scalars['UUID']['output'];
  isCanceled: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  startTime: Scalars['NaiveDateTime']['output'];
  title: Scalars['String']['output'];
  userId: Scalars['UUID']['output'];
};

export type Course = {
  __typename?: 'Course';
  academicDepartment?: Maybe<Scalars['String']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
  id: Scalars['UUID']['output'];
  isFavorite: Scalars['Boolean']['output'];
  moduleId?: Maybe<Scalars['UUID']['output']>;
  name: Scalars['String']['output'];
  teacher?: Maybe<Scalars['String']['output']>;
  userId: Scalars['UUID']['output'];
};

export type Module = {
  __typename?: 'Module';
  courses: Array<Course>;
  endSemester?: Maybe<Scalars['UUID']['output']>;
  etCs: Scalars['Int']['output'];
  grade?: Maybe<Scalars['Float']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  startSemester: Scalars['UUID']['output'];
  userId: Scalars['UUID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCourse: Course;
  createModule: Module;
  createMultipleCourses: Array<Course>;
  createSemester: Semester;
  createTodo: Todo;
  processSemesterCalendar: Array<RecurringAppointment>;
  updateCourse: Course;
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
  input: Array<NewCourse>;
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


export type MutationUpdateCourseArgs = {
  input: NewCourse;
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
  id?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  moduleId?: InputMaybe<Scalars['String']['input']>;
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
  courseId?: InputMaybe<Scalars['UUID']['input']>;
  dueOn: Scalars['NaiveDateTime']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  appointments: Array<Appointment>;
  calendarLink?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courses: Array<Course>;
  module?: Maybe<Module>;
  modules: Array<Module>;
  semester?: Maybe<Semester>;
  semesters: Array<Semester>;
  todo?: Maybe<Todo>;
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
  endDate: Scalars['NaiveDate']['output'];
  id: Scalars['UUID']['output'];
  importedAppointments: Scalars['Boolean']['output'];
  modules: Array<Module>;
  semester: Scalars['Int']['output'];
  semesterHash: Scalars['String']['output'];
  startDate: Scalars['NaiveDate']['output'];
  totalEcTs: Scalars['Int']['output'];
  userId: Scalars['UUID']['output'];
};

export type Settings = {
  __typename?: 'Settings';
  calendarLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  userId: Scalars['UUID']['output'];
};

export type Todo = {
  __typename?: 'Todo';
  courseId?: Maybe<Scalars['UUID']['output']>;
  dueOn: Scalars['NaiveDateTime']['output'];
  id: Scalars['UUID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  status: TodoStatus;
  title: Scalars['String']['output'];
  type: TodoType;
  userId: Scalars['UUID']['output'];
};

export type TodoStatus =
  | 'COMPLETED'
  | 'INPROGRESS'
  | 'PENDING';

export type TodoType =
  | 'ASSIGNMENT'
  | 'EXAM'
  | 'GENERAL';

export type UpdateTodo = {
  courseId?: InputMaybe<Scalars['UUID']['input']>;
  dueOn: Scalars['NaiveDateTime']['input'];
  id: Scalars['UUID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type WeekdayEnum =
  | 'FRIDAY'
  | 'MONDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'THURSDAY'
  | 'TUESDAY'
  | 'WEDNESDAY';
