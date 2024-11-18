use crate::{graphql::courses::CourseQuery, models::_entities::course::Model as Course};
use async_graphql::{Context, Object};
use sea_orm::DatabaseConnection;
use types::user::DatabaseUser;
use uuid::Uuid;

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
            id: Uuid::parse_str(id.as_str()).unwrap(),
            name: "test".into(),
            grade: None,
            teacher: None,
            academic_department: None,
            module_id: Uuid::parse_str(id.as_str()).unwrap(),
            user_id: Uuid::parse_str(user.id.clone().as_str()).unwrap(),
        })
    }
}
