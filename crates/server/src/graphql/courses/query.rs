use crate::{
    graphql::courses::CourseQuery,
    models::_entities::{course, course::Model as Course, user},
};
use async_graphql::{Context, Object};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use uuid::Uuid;

#[Object]
impl CourseQuery {
    pub async fn course(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<Course>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;

        course::Entity::find()
            .filter(
                course::Column::UserId
                    .eq(user.id)
                    .and(course::Column::Id.eq(id)),
            )
            .one(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }
    pub async fn courses(&self, ctx: &Context<'_>) -> Result<Vec<Course>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;
        course::Entity::find()
            .filter(course::Column::UserId.eq(user.id))
            .all(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }
}
