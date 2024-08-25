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
  ects: Scalars['Int']['output'];
  endSemester: Scalars['String']['output'];
  grade?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startSemester: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createModule: Module;
  createSemester: Semester;
  createTodo: Todo;
};


export type MutationCreateModuleArgs = {
  input: NewModule;
};


export type MutationCreateSemesterArgs = {
  input: NewSemester;
};


export type MutationCreateTodoArgs = {
  input: NewTodo;
};

export type NewModule = {
  ects: Scalars['Int']['input'];
  endSemester: Scalars['String']['input'];
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
  icon: Scalars['String']['input'];
  title: Scalars['String']['input'];
  todoType?: InputMaybe<TodoType>;
};

export type Query = {
  __typename?: 'Query';
  module: Module;
  modules: Array<Module>;
  semester: Semester;
  semesters: Array<Semester>;
  todo: Todo;
  todos: Array<Todo>;
  todosByDate: Array<Todo>;
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

export type Semester = {
  __typename?: 'Semester';
  courses: Array<Course>;
  endDate: Scalars['NaiveDate']['output'];
  id: Scalars['String']['output'];
  modules: Array<Module>;
  semester: Scalars['Int']['output'];
  startDate: Scalars['NaiveDate']['output'];
  totalEcts: Scalars['Int']['output'];
};

export type Todo = {
  __typename?: 'Todo';
  courseId?: Maybe<Scalars['String']['output']>;
  dueOn: Scalars['NaiveDateTime']['output'];
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  todoType: TodoType;
  userId: Scalars['String']['output'];
};

export enum TodoType {
  Assignment = 'ASSIGNMENT',
  Exam = 'EXAM',
  General = 'GENERAL'
}

export type CreateSemesterMutationMutationVariables = Exact<{
  input: NewSemester;
}>;


export type CreateSemesterMutationMutation = { __typename?: 'Mutation', createSemester: { __typename?: 'Semester', id: string } };

export type GetAllSemesterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSemesterQuery = { __typename?: 'Query', semesters: Array<{ __typename?: 'Semester', id: string, semester: number, endDate: any, totalEcts: number, startDate: any, modules: Array<{ __typename?: 'Module', id: string, name: string, ects: number, grade?: number | null, startSemester: string, endSemester: string }>, courses: Array<{ __typename?: 'Course', id: string, name: string, grade?: number | null, teacher?: string | null, academicDepartment?: string | null }> }> };

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

export const CreateSemesterMutationDocument = new TypedDocumentString(`
    mutation createSemesterMutation($input: NewSemester!) {
  createSemester(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateSemesterMutationMutation, CreateSemesterMutationMutationVariables>;
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