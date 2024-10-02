use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::course::{Course, NewCourse};
use types::user::DatabaseUser;
use uuid::Uuid;

use super::CourseMutation;

#[Object]
impl CourseMutation {
    pub async fn create_course(
        &self,
        ctx: &Context<'_>,
        input: NewCourse,
    ) -> Result<Course, async_graphql::Error> {
        let db = ctx.data::<Pool<Sqlite>>()?;
        let user = ctx.data::<DatabaseUser>()?;
        let id = Uuid::new_v4();

        Ok(Course {
            id: "test".into(),
            name: "test".into(),
            grade: None,
            teacher: None,
            academic_department: None,
        })
    }
}
