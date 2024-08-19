use crate::graphql::semester::SemesterMutation;
use crate::routers::auth::DatabaseUser;
use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::semester::{NewSemester, Semester};
use uuid::Uuid;

#[Object]
impl SemesterMutation {
    pub async fn create_semester(
        &self,
        ctx: &Context<'_>,
        input: NewSemester,
    ) -> Result<Semester, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        let id = Uuid::new_v4();
        sqlx::query_as::<_, Semester>(
            "INSERT INTO semester (id, semester, start_date, end_date, total_ects, user_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING *;"
        )
            .bind(id.to_string())
            .bind(input.semester)
            .bind(input.start_date)
            .bind(input.end_date)
            .bind(input.total_ects)
            .bind(user.id.clone())
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
