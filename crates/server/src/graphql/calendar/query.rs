use super::CalendarQuery;

use crate::models::_entities::{
    appointment, appointment::Model as Appointment, settings, user::Model as User,
};
use async_graphql::*;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
#[Object]
impl CalendarQuery {
    pub async fn calendar_link(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Option<String>, async_graphql::Error> {
        let user = ctx.data::<User>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        // Use SeaORM to fetch optional settings
        let result = settings::Entity::find()
            .filter(settings::Column::UserId.eq(user.id.clone()))
            .one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))?;

        // Return the calendar link if settings were found, otherwise None
        Ok(result.and_then(|settings| settings.calendar_link))
    }

    pub async fn appointments(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Vec<Appointment>, async_graphql::Error> {
        let user = ctx.data::<User>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();

        // Fetch all appointments for the user using SeaORM
        let appointments = appointment::Entity::find()
            .filter(appointment::Column::UserId.eq(user.id.clone()))
            .all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))?;

        Ok(appointments)
    }
}
