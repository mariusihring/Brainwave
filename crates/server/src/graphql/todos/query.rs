use super::TodoQuery;
use crate::models::_entities::{todo, user::Model as User};
use ::types::todo::Todo;
use async_graphql::{Context, Object};
use chrono::{NaiveDate, NaiveDateTime};
use sea_orm::DatabaseConnection;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use uuid::Uuid;

#[Object]
impl TodoQuery {
    async fn todo(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<todo::Model>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>().unwrap();
        let user = ctx.data::<User>().unwrap();

        todo::Entity::find()
            .filter(
                todo::Column::Id
                    .eq(Uuid::parse_str(id.as_str()).unwrap())
                    .and(todo::Column::UserId.eq(user.id)),
            )
            .one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }

    async fn todos(&self, ctx: &Context<'_>) -> Result<Vec<todo::Model>, async_graphql::Error> {
        let user = ctx.data::<User>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        todo::Entity::find()
            .filter(todo::Column::UserId.eq(user.id))
            .all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }

    async fn todos_by_date(
        &self,
        ctx: &Context<'_>,
        date: NaiveDate,
    ) -> Result<Vec<todo::Model>, async_graphql::Error> {
        let user = ctx.data::<User>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        todo::Entity::find()
            .filter(
                todo::Column::UserId
                    .eq(user.id)
                    .and(todo::Column::DueOn.eq(date)),
            )
            .all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
