use crate::graphql::semester::SemesterMutation;
use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::semester::{NewSemester, Semester};
use types::user::DatabaseUser;
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
        let semester_hash = format!("{}_{}", user.id.clone(), input.semester.clone());
        //TODO: when there is allready a semester with the same id so i get a constraint error the return a pretty statusmessage to show in the error toast :)
        sqlx::query_as::<_, Semester>(
            "INSERT INTO semester (id, semester, start_date, end_date, total_ects, user_id, semester_hash) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *;"
        )
            .bind(id.to_string())
            .bind(input.semester)
            .bind(input.start_date)
            .bind(input.end_date)
            .bind(input.total_ects)
            .bind(user.id.clone())
            .bind(semester_hash)
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
