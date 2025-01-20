use crate::{
    graphql::exams::ExamQuery,
    models::_entities::{exam, exam::Model as Exam, user},
};
use async_graphql::{Context, Object};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use uuid::Uuid;

#[Object]
impl ExamQuery {
    pub async fn exam(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<Exam>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;

        exam::Entity::find()
            .filter(
                exam::Column::UserId
                    .eq(user.id)
                    .and(exam::Column::Id.eq(id)),
            )
            .one(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }
    pub async fn exams(&self, ctx: &Context<'_>) -> Result<Vec<Exam>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;
        exam::Entity::find()
            .filter(exam::Column::UserId.eq(user.id))
            .all(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }
}
