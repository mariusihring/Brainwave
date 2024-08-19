use crate::routers::auth::DatabaseUser;

use super::TodoMutation;
use ::types::todo::{NewTodo, Todo};
use async_graphql::*;
use sqlx::{Pool, Sqlite};
use uuid::Uuid;

#[Object]
impl TodoMutation {
    async fn create_todo(&self, ctx: &Context<'_>, input: NewTodo) -> Result<Todo> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        let id = Uuid::new_v4();
        let query = format!(
            r#"INSERT INTO todos (id, title, due_on,todo_type, course_id, user_id) VALUES ("{}", "{}", "{}", "?", ?, "{}") RETURNING *;"#,
            id,
            input.title.clone(),
            input.due_on.clone(),
            user.id.clone()
        );
        sqlx::query_as::<_, Todo>(query.as_str())
            .bind(input.todo_type.clone())
            .bind(input.course_id)
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
