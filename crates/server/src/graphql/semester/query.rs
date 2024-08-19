use crate::graphql::semester::SemesterQuery;
use crate::routers::auth::DatabaseUser;
use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::semester::Semester;

#[Object]
impl SemesterQuery {
    pub async fn semester(
        &self,
        ctx: &Context<'_>,
        semester: i32,
    ) -> Result<Semester, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        sqlx::query_as::<_, Semester>(
            "SELECT * FROM semester WHERE user_id = ? AND semester = ? LIMIT 1;",
        )
        .bind(user.id.clone())
        .bind(semester)
        .fetch_one(db)
        .await
        .map_err(|err| async_graphql::Error::from(err))
    }
}
