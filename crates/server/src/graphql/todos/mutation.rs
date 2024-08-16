use super::TodoMutation;
use async_graphql::*;
use ::types::todo::NewTodo;

#[Object]
impl TodoMutation {
    async fn create_todo(&self, input: NewTodo) -> String {
        String::from("test")
    }
}
