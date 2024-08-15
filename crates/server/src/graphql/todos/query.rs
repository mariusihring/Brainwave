use super::TodoQuery;
use async_graphql::*;

#[Object]
impl TodoQuery {
    async fn todo(&self, id: i32) -> String {
        String::from("test")
    }
}
