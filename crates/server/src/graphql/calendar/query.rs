use ::types::{settings::Settings, user::DatabaseUser};
use async_graphql::*;
use sqlx::{Pool, Sqlite};

use super::CalendarQuery;

#[Object]
impl CalendarQuery {
    pub async fn calendar_link(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Option<String>, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();

        sqlx::query_as::<_, Settings>(
            "SELECT id, user_id, calendar_link FROM settings WHERE user_id = ? LIMIT 1;",
        )
        .bind(user.id.clone())
        .fetch_optional(db)
        .await
        .map(|result| result.map(|settings| settings.calendar_link).flatten())
        .map_err(|err| async_graphql::Error::from(err))
    }
}
