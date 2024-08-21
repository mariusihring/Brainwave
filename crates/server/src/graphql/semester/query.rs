use crate::graphql::semester::SemesterQuery;
use async_graphql::{ComplexObject, Context, Object};
use sqlx::{Pool, Sqlite};
use types::semester::Semester;
use types::user::DatabaseUser;

#[Object]
impl SemesterQuery {
    pub async fn semester(
        &self,
        ctx: &Context<'_>,
        semester: i32,
    ) -> Result<Semester, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>()?;
        let db = ctx.data::<Pool<Sqlite>>()?;
        sqlx::query_as::<_, Semester>(
            "SELECT * FROM semester WHERE user_id = ? AND semester = ? LIMIT 1;",
        )
        .bind(user.id.clone())
        .bind(semester)
        .fetch_one(db)
        .await
        .map_err(|err| async_graphql::Error::from(err))
    }

    pub async fn semesters(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Vec<Semester>, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>()?;
        let db = ctx.data::<Pool<Sqlite>>()?;
        let rows: Vec<Semester> = sqlx::query_as("SELECT * FROM semester WHERE user_id = ?;")
            .bind(user.id.clone())
            .fetch_all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
            .unwrap();
        Ok(rows)
    }
}
