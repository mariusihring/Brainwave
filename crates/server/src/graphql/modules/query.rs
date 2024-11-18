use crate::graphql::modules::ModuleQuery;
use crate::models::_entities::module;
use async_graphql::{Context, Object};
use sea_orm::DatabaseConnection;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use types::user::DatabaseUser;

#[Object]
impl ModuleQuery {
    pub async fn module(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<module::Model>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<DatabaseUser>()?;

        module::Entity::find()
            .filter(
                module::Column::Id
                    .eq(id)
                    .and(module::Column::UserId.eq(user.id.clone())),
            )
            .one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }

    pub async fn modules(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Vec<module::Model>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<DatabaseUser>()?;

        module::Entity::find()
            .filter(module::Column::UserId.eq(&user.id))
            .all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
