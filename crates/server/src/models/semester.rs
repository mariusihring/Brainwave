use super::_entities::{course, module, semester::Model, user};
use async_graphql::*;
use chrono::NaiveDate;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[ComplexObject]
impl Model {
    async fn modules(&self, ctx: &Context<'_>) -> Vec<module::Model> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        match module::Entity::find()
            .filter(
                module::Column::UserId
                    .eq(user.id)
                    .and(module::Column::StartSemester.eq(self.id))
                    .or(module::Column::EndSemester.eq(self.id)),
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
pub struct NewSemester {
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}
