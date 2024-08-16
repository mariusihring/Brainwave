use super::TodoMutation;
use ::types::todo::{NewTodo, Todo};
use async_graphql::*;

#[Object]
impl TodoMutation {
    async fn create_todo(&self, input: NewTodo) -> Todo {
        Todo {
            id: "random_id".into(),
            title: input.title,
            due_on: input.due_on,
            icon: input.icon,
            user_id: "random_id".into(),
        }
    }
}
