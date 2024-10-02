use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::course::{Course, NewCourse};
use types::user::DatabaseUser;
use uuid::Uuid;

use super::CourseQuery;

#[Object]
impl CourseQuery {
    pub async fn course(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Course, async_graphql::Error> {
        let db = ctx.data::<Pool<Sqlite>>()?;
        let user = ctx.data::<DatabaseUser>()?;

        Ok(Course {
            id,
            name: "test".into(),
            grade: None,
            teacher: None,
            academic_department: None,
        })
    }
}
