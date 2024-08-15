use super::TodoMutation;
use async_graphql::*;

#[Object]
impl TodoMutation {
    async fn create_todo(&self) -> String {
        String::from("test")
    }
}
