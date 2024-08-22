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
    "\n\tquery getAllSemester {\n\t\tsemesters {\n\t\t\tid\n\t\t\tsemester\n\t\t\tendDate\n\t\t\ttotalEcts\n\t\t\tmodules {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tects\n\t\t\t\tgrade\n\t\t\t\tstartSemester\n\t\t\t\tendSemester\n\t\t\t}\n\t\t\tcourses {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tgrade\n\t\t\t\tteacher\n\t\t\t\tacademicDepartment\n\t\t\t}\n\t\t\tstartDate\n\t\t}\n\t}\n": types.GetAllSemesterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery getAllSemester {\n\t\tsemesters {\n\t\t\tid\n\t\t\tsemester\n\t\t\tendDate\n\t\t\ttotalEcts\n\t\t\tmodules {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tects\n\t\t\t\tgrade\n\t\t\t\tstartSemester\n\t\t\t\tendSemester\n\t\t\t}\n\t\t\tcourses {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tgrade\n\t\t\t\tteacher\n\t\t\t\tacademicDepartment\n\t\t\t}\n\t\t\tstartDate\n\t\t}\n\t}\n"): typeof import('./graphql').GetAllSemesterDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
