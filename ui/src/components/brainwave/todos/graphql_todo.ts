import { execute } from "@/execute";
import { graphql } from "@/graphql";
import type { UpdateTodoStatusMutationMutationVariables } from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";

export const TODO_INDEX_QUERY = graphql(`
    query TodoIndexQuery{
        todos {
            id
            title
            dueOn
            userId

        }
    }
`);

export const UPDATE_TODO_STATUS_MUTATION = graphql(`
    mutation UpdateTodoStatusMutation($id: String!, $input: UpdateTodo!) {
        updateTodo(id: $id, input: $input) {
            id
            title
            dueOn
            userId
            
        }
    }
`);

export function useUpdateTodoMutation() {
	return useMutation({
		mutationKey: ["update_todo_index"],
		mutationFn: (props: UpdateTodoStatusMutationMutationVariables) =>
			execute(UPDATE_TODO_STATUS_MUTATION, { ...props }),
	});
}
