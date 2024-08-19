use crate::graphql::modules::ModuleMutation;
use crate::routers::auth::DatabaseUser;
use async_graphql::{Context, Object};
use sqlx::{Pool, Sqlite};
use types::module::{Module, NewModule};
use uuid::Uuid;

#[Object]
impl ModuleMutation {
    pub async fn create_module(
        &self,
        ctx: &Context<'_>,
        input: NewModule,
    ) -> Result<Module, async_graphql::Error> {
        let db = ctx.data::<Pool<Sqlite>>()?;
        let user = ctx.data::<DatabaseUser>()?;
        let id = Uuid::new_v4();
        sqlx::query_as::<_, Module>(
            "INSERT INTO modules (id,name, ects, grade, start_semester, end_semester, user_id) VALUES (?, ?, ?,?, ?, ? , ?) RETURNING *;"
        )
            .bind(id.to_string())
            .bind(input.name)
            .bind(input.ects)
            .bind(input.grade)
            .bind(input.start_semester)
            .bind(input.end_semester)
            .bind(user.id.clone())
            .fetch_one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
