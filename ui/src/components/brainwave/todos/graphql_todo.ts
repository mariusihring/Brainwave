import { execute } from "@/execute";
import {graphql} from "@/graphql";
import { UpdateTodoStatusMutationMutationVariables } from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";

export const TODO_INDEX_QUERY = graphql(`
    query TodoIndexQuery{
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
`)

export const UPDATE_TODO_STATUS_MUTATION = graphql(`
    mutation UpdateTodoStatusMutation($id: String!, $input: NewTodo!) {
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
`)


export function useUpdateTodoMutation() {
  return useMutation({
    mutationKey: ["update_todo_index"],
    mutationFn: (props: UpdateTodoStatusMutationMutationVariables) =>
      execute(UPDATE_TODO_STATUS_MUTATION, {...props})
  });
}