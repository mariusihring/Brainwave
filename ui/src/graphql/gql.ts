/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query getCalendarLink {\n    calendarLink\n  }\n": types.GetCalendarLinkDocument,
    "\n  mutation SaveCalendarLink($link: String!) {\n    upsertCalendarLink(calendarLink: $link) {\n      id\n    }\n  }\n": types.SaveCalendarLinkDocument,
    "\n    mutation createSemester($input: NewSemester!) {\n        createSemester(input: $input) {\n            id\n        }\n    }\n": types.CreateSemesterDocument,
    "\n  query getCourses {\n    courses {\n      id\n      name\n      grade\n      teacher\n      academicDepartment\n    }\n  }\n": types.GetCoursesDocument,
    "\n  mutation ProcessCalendar($input: String!) {\n    processSemesterCalendar(semesterId: $input) {\n      name\n      weekday\n      startTime\n      endTime\n      location\n    }\n  }\n": types.ProcessCalendarDocument,
    "\n  mutation createCourses($input: [String!]!) {\n    createMultipleCourses(input: $input) {\n      academicDepartment\n      grade\n      id\n      name\n      teacher\n    }\n  }\n": types.CreateCoursesDocument,
    "\n  mutation createSemesterMutation($input: NewSemester!) {\n    createSemester(input: $input) {\n      id\n      semester\n    }\n  }\n": types.CreateSemesterMutationDocument,
    "\n  mutation CreateModule($input: NewModule!) {\n    createModule(input: $input) {\n      id\n      etCs\n      name\n      startSemester\n      endSemester\n      grade\n    }\n  }\n": types.CreateModuleDocument,
    "\n    mutation createTodoMutation($input: NewTodo!) {\n        createTodo(input: $input) {\n            id\n        }\n    }\n": types.CreateTodoMutationDocument,
    "\n    query TodoIndexQuery{\n        todos {\n            id\n            title\n            dueOn\n            userId\n\n        }\n    }\n": types.TodoIndexQueryDocument,
    "\n    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {\n        updateTodo(id: $id, input: $input) {\n            id\n            title\n            dueOn\n            userId\n            \n        }\n    }\n": types.UpdateTodoStatusMutationDocument,
    "\n  query AppointmentQuery {\n    appointments {\n      id\n      title\n      date\n      endTime\n      startTime\n      location\n    }\n  }\n": types.AppointmentQueryDocument,
    "\n\tquery TodoDashboardQuery{\n\t\ttodos {\n\t\t\tid\n\t\t\ttitle\n\t\t\tdueOn\n\t\t}\n\t}\n": types.TodoDashboardQueryDocument,
    "\n  query ModuleIndexQuery {\n   modules {\n  id\n  userId\n name\netCs\nstartSemester\nendSemester\ngrade\n}\n}\n": types.ModuleIndexQueryDocument,
    "\n  query getAllSemester {\n    semesters {\n      id\n      semester\n      endDate\n      totalEcTs\n      modules {\n        id\n        name\n        etCs\n        grade\n        startSemester\n        endSemester\n      }\n      courses {\n        id\n        name\n        grade\n        teacher\n        academicDepartment\n      }\n      startDate\n    }\n  }\n": types.GetAllSemesterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCalendarLink {\n    calendarLink\n  }\n"): typeof import('./graphql').GetCalendarLinkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveCalendarLink($link: String!) {\n    upsertCalendarLink(calendarLink: $link) {\n      id\n    }\n  }\n"): typeof import('./graphql').SaveCalendarLinkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createSemester($input: NewSemester!) {\n        createSemester(input: $input) {\n            id\n        }\n    }\n"): typeof import('./graphql').CreateSemesterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCourses {\n    courses {\n      id\n      name\n      grade\n      teacher\n      academicDepartment\n    }\n  }\n"): typeof import('./graphql').GetCoursesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ProcessCalendar($input: String!) {\n    processSemesterCalendar(semesterId: $input) {\n      name\n      weekday\n      startTime\n      endTime\n      location\n    }\n  }\n"): typeof import('./graphql').ProcessCalendarDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCourses($input: [String!]!) {\n    createMultipleCourses(input: $input) {\n      academicDepartment\n      grade\n      id\n      name\n      teacher\n    }\n  }\n"): typeof import('./graphql').CreateCoursesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createSemesterMutation($input: NewSemester!) {\n    createSemester(input: $input) {\n      id\n      semester\n    }\n  }\n"): typeof import('./graphql').CreateSemesterMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateModule($input: NewModule!) {\n    createModule(input: $input) {\n      id\n      etCs\n      name\n      startSemester\n      endSemester\n      grade\n    }\n  }\n"): typeof import('./graphql').CreateModuleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createTodoMutation($input: NewTodo!) {\n        createTodo(input: $input) {\n            id\n        }\n    }\n"): typeof import('./graphql').CreateTodoMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TodoIndexQuery{\n        todos {\n            id\n            title\n            dueOn\n            userId\n\n        }\n    }\n"): typeof import('./graphql').TodoIndexQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {\n        updateTodo(id: $id, input: $input) {\n            id\n            title\n            dueOn\n            userId\n            \n        }\n    }\n"): typeof import('./graphql').UpdateTodoStatusMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AppointmentQuery {\n    appointments {\n      id\n      title\n      date\n      endTime\n      startTime\n      location\n    }\n  }\n"): typeof import('./graphql').AppointmentQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery TodoDashboardQuery{\n\t\ttodos {\n\t\t\tid\n\t\t\ttitle\n\t\t\tdueOn\n\t\t}\n\t}\n"): typeof import('./graphql').TodoDashboardQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ModuleIndexQuery {\n   modules {\n  id\n  userId\n name\netCs\nstartSemester\nendSemester\ngrade\n}\n}\n"): typeof import('./graphql').ModuleIndexQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllSemester {\n    semesters {\n      id\n      semester\n      endDate\n      totalEcTs\n      modules {\n        id\n        name\n        etCs\n        grade\n        startSemester\n        endSemester\n      }\n      courses {\n        id\n        name\n        grade\n        teacher\n        academicDepartment\n      }\n      startDate\n    }\n  }\n"): typeof import('./graphql').GetAllSemesterDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
