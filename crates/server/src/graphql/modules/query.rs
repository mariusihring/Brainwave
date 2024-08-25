use crate::graphql::modules::ModuleQuery;
use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::module::Module;
use types::user::DatabaseUser;

#[Object]
impl ModuleQuery {
    pub async fn module(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Module, async_graphql::Error> {
        let db = ctx.data::<Pool<Sqlite>>()?;
        let user = ctx.data::<DatabaseUser>()?;
        sqlx::query_as::<_, Module>("SELECT * FROM modules WHERE id = ? AND user_id = ? LIMIT 1;")
            .bind(id)
            .bind(user.id.clone())
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }

    pub async fn modules(&self, ctx: &Context<'_>) -> Result<Vec<Module>, async_graphql::Error> {
        let db = ctx.data::<Pool<Sqlite>>()?;
        let user = ctx.data::<DatabaseUser>()?;

        let modules: Vec<Module> = sqlx::query_as("SELECT * FROM modules WHERE user_id = ?;")
            .bind(user.id.clone())
            .fetch_all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))?;

        Ok(modules)
    }
}
