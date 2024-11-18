use async_graphql::{Context, Object};

use sea_orm::DatabaseConnection;
use types::course::Course;
use types::user::DatabaseUser;

use super::CourseQuery;

#[Object]
impl CourseQuery {
    pub async fn course(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Course, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
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
