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
 */
const documents = {
    "\n  query getCalendarLink {\n    calendarLink\n  }\n": types.GetCalendarLinkDocument,
    "\n  mutation SaveCalendarLink($link: String!) {\n    upsertCalendarLink(calendarLink: $link) {\n      id\n    }\n  }\n": types.SaveCalendarLinkDocument,
    "\n  mutation ProcessCalendar {\n    processSemesterCalendar {\n      name\n      weekday\n      startTime\n      endTime\n      location\n    }\n  }\n": types.ProcessCalendarDocument,
    "\n    mutation createSemester($input: NewSemester!) {\n        createSemester(input: $input) {\n            id\n        }\n    }\n": types.CreateSemesterDocument,
    "\n  mutation createSemesterMutation($input: NewSemester!)  {\n    createSemester(input: $input) {\n      id\n      semester\n    }\n  }\n  ": types.CreateSemesterMutationDocument,
    "\n    mutation createTodoMutation($input: NewTodo!) {\n        createTodo(input: $input) {\n            id\n        }\n    }\n": types.CreateTodoMutationDocument,
    "\n    query TodoIndexQuery{\n        todos {\n            id\n            title\n            dueOn\n            userId\n            todoType\n            status\n            course {\n                id\n                name\n                grade\n                teacher\n                academicDepartment\n            }\n        }\n    }\n": types.TodoIndexQueryDocument,
    "\n    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {\n        updateTodo(id: $id, input: $input) {\n            id\n            title\n            dueOn\n            userId\n            todoType\n            status\n            course {\n                id\n                name\n                grade\n                teacher\n                academicDepartment\n            }\n        }\n    }\n": types.UpdateTodoStatusMutationDocument,
    "\n\tquery AppointmentQuery {\n\t\tappointments {\n\t\t\tid\n\t\t\tdate\n\t\t\tendTime\n\t\t\tstartTime\n\t\t\tlocation\n\t\t\tname\n\t\t}\n\t}\n": types.AppointmentQueryDocument,
    "\n\tquery TodoDashboardQuery{\n\t\ttodos {\n\t\t\tid\n\t\t\ttitle\n\t\t\tdueOn\n\t\t\ttodoType\n\t\t}\n\t}\n": types.TodoDashboardQueryDocument,
    "\n\tquery getAllSemester {\n\t\tsemesters {\n\t\t\tid\n\t\t\tsemester\n\t\t\tendDate\n\t\t\ttotalEcts\n\t\t\tmodules {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tects\n\t\t\t\tgrade\n\t\t\t\tstartSemester\n\t\t\t\tendSemester\n\t\t\t}\n\t\t\tcourses {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tgrade\n\t\t\t\tteacher\n\t\t\t\tacademicDepartment\n\t\t\t}\n\t\t\tstartDate\n\t\t}\n\t}\n": types.GetAllSemesterDocument,
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
export function graphql(source: "\n  mutation ProcessCalendar {\n    processSemesterCalendar {\n      name\n      weekday\n      startTime\n      endTime\n      location\n    }\n  }\n"): typeof import('./graphql').ProcessCalendarDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createSemester($input: NewSemester!) {\n        createSemester(input: $input) {\n            id\n        }\n    }\n"): typeof import('./graphql').CreateSemesterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createSemesterMutation($input: NewSemester!)  {\n    createSemester(input: $input) {\n      id\n      semester\n    }\n  }\n  "): typeof import('./graphql').CreateSemesterMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createTodoMutation($input: NewTodo!) {\n        createTodo(input: $input) {\n            id\n        }\n    }\n"): typeof import('./graphql').CreateTodoMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TodoIndexQuery{\n        todos {\n            id\n            title\n            dueOn\n            userId\n            todoType\n            status\n            course {\n                id\n                name\n                grade\n                teacher\n                academicDepartment\n            }\n        }\n    }\n"): typeof import('./graphql').TodoIndexQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {\n        updateTodo(id: $id, input: $input) {\n            id\n            title\n            dueOn\n            userId\n            todoType\n            status\n            course {\n                id\n                name\n                grade\n                teacher\n                academicDepartment\n            }\n        }\n    }\n"): typeof import('./graphql').UpdateTodoStatusMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery AppointmentQuery {\n\t\tappointments {\n\t\t\tid\n\t\t\tdate\n\t\t\tendTime\n\t\t\tstartTime\n\t\t\tlocation\n\t\t\tname\n\t\t}\n\t}\n"): typeof import('./graphql').AppointmentQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery TodoDashboardQuery{\n\t\ttodos {\n\t\t\tid\n\t\t\ttitle\n\t\t\tdueOn\n\t\t\ttodoType\n\t\t}\n\t}\n"): typeof import('./graphql').TodoDashboardQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery getAllSemester {\n\t\tsemesters {\n\t\t\tid\n\t\t\tsemester\n\t\t\tendDate\n\t\t\ttotalEcts\n\t\t\tmodules {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tects\n\t\t\t\tgrade\n\t\t\t\tstartSemester\n\t\t\t\tendSemester\n\t\t\t}\n\t\t\tcourses {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tgrade\n\t\t\t\tteacher\n\t\t\t\tacademicDepartment\n\t\t\t}\n\t\t\tstartDate\n\t\t}\n\t}\n"): typeof import('./graphql').GetAllSemesterDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
