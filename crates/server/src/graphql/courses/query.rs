use crate::{
    graphql::courses::CourseQuery,
    models::_entities::{course::Model as Course, user},
};
use async_graphql::{Context, Object};
use sea_orm::DatabaseConnection;
use uuid::Uuid;

#[Object]
impl CourseQuery {
    pub async fn course(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Course, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;

        Ok(Course {
            id: Uuid::parse_str(id.as_str()).unwrap(),
            name: "test".into(),
            grade: None,
            teacher: None,
            academic_department: None,
            module_id: Some(Uuid::parse_str(id.as_str()).unwrap()),
            user_id: user.id,
        })
    }
    pub async fn courses(&self, ctx: &Context<'_>) -> Result<Vec<Course>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;

        Ok(vec![Course {
            id: Uuid::new_v4(),
            name: "test".into(),
            grade: None,
            teacher: None,
            academic_department: None,
            module_id: Some(Uuid::new_v4()),
            user_id: user.id,
        }])
    }
}
