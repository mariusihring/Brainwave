use types::user::DatabaseUser;

use super::TodoQuery;
use ::types::todo::Todo;
use async_graphql::{Context, Object};
use chrono::{NaiveDate, NaiveDateTime};
use sqlx::{Pool, Sqlite};

#[Object]
impl TodoQuery {
    async fn todo(&self, ctx: &Context<'_>, id: String) -> Result<Todo, async_graphql::Error> {
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        let query = format!(r#"SELECT * FROM todos WHERE id = "{}" LIMIT 1;"#, id,);
        sqlx::query_as::<_, Todo>(query.as_str())
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }

    async fn todos(&self, ctx: &Context<'_>) -> Result<Vec<Todo>, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        let query = format!(r#"SELECT * FROM todos WHERE user_id = "{}";"#, user.id,);
        let todos: Vec<Todo> = sqlx::query_as(query.as_str())
            .fetch_all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
            .unwrap();
        Ok(todos)
    }

    async fn todos_by_date(
        &self,
        ctx: &Context<'_>,
        date: NaiveDate,
    ) -> Result<Vec<Todo>, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        let query = format!(
            r#"SELECT * FROM todos WHERE user_id = "{}" AND due_on LIKE "%{}%";"#,
            user.id, date
        );
        let todos: Vec<Todo> = sqlx::query_as(query.as_str())
            .fetch_all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
            .unwrap();
        Ok(todos)
    }
}
