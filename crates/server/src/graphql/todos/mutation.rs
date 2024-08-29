use super::TodoMutation;
use ::types::todo::UpdateTodo;
use ::types::todo::{NewTodo, Todo};
use ::types::user::DatabaseUser;
use async_graphql::*;
use sqlx::{Pool, Sqlite};
use uuid::Uuid;

#[Object]
impl TodoMutation {
    async fn create_todo(&self, ctx: &Context<'_>, input: NewTodo) -> Result<Todo> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        let id = Uuid::new_v4();
        sqlx::query_as::<_, Todo>(
            "INSERT INTO todos (id, title, due_on, type, course_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?) RETURNING *;",
        )
        .bind(id.to_string())
        .bind(input.title)
        .bind(input.due_on)
        .bind(
            input
                .todo_type
                .map(|t| t.to_string())
                .unwrap_or("general".to_string()),
        )
        .bind(input.course_id)
        .bind(user.id.clone())
        .fetch_one(db)
        .await
        .map_err(|err| async_graphql::Error::from(err))
    }

    async fn update_todo(&self, ctx: &Context<'_>, input: UpdateTodo, id: String) -> Result<Todo> {
        let user = ctx.data::<DatabaseUser>()?;
        let db = ctx.data::<Pool<Sqlite>>()?;

        sqlx::query_as::<_, Todo>(
            "UPDATE todos SET due_on = ?,type = ?, course_id = ?, title = ?, status = ?  WHERE id = ? RETURNING *",
        )
            .bind(input.due_on.clone())
            .bind(
                input
                    .todo_type
                    .map(|t| t.to_string())
                    .unwrap_or("general".to_string()),
            )
            .bind(input.course_id.clone())
            .bind(input.title.clone())
            .bind(input.status.clone())
            .bind(id)
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
