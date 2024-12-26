use super::_entities::{course, module::Model, user};
use async_graphql::*;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(InputObject)]
pub struct NewModule {
    pub name: String,
    pub ects: i32,
    pub grade: Option<f32>,
    pub start_semester: String,
    pub end_semester: Option<String>,
}

#[ComplexObject]
impl Model {
    async fn courses(&self, ctx: &Context<'_>) -> Vec<course::Model> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        match course::Entity::find()
            .filter(
                course::Column::UserId
                    .eq(user.id)
                    .and(course::Column::ModuleId.eq(self.id)),
            )
            .all(db)
            .await
        {
            Ok(c) => c,
            Err(_) => vec![],
        }
    }
}
