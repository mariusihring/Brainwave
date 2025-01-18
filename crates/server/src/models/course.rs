use async_graphql::*;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use crate::models::_entities::semester::Model;
use super::_entities::{course, todo, user};

#[ComplexObject]
impl Model {
    async fn todos(&self, ctx: &Context<'_>) -> Vec<todo::Model> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        match todo::Entity::find()
            .filter(
                todo::Column::UserId
                    .eq(user.id)
                    .and(todo::Column::CourseId.eq(self.id))
            )
            .all(db)
            .await
        {
            Ok(c) => c,
            Err(_) => vec![],
        }
    }
}

#[derive(InputObject)]
pub struct NewCourse {
    pub id: Option<String>,
    pub name: String,
    pub grade: Option<f32>,
    pub teacher: Option<String>,
    pub academic_department: Option<String>,
    pub module_id: Option<String>,
    pub is_favorite: Option<bool>
}
