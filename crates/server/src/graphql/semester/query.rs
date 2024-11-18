use crate::graphql::semester::SemesterQuery;
use crate::models::_entities::semester;
use async_graphql::{ComplexObject, Context, Object};
use sea_orm::DatabaseConnection;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use types::semester::Semester;
use types::user::DatabaseUser;

#[Object]
impl SemesterQuery {
    pub async fn semester(
        &self,
        ctx: &Context<'_>,
        semester: i32,
    ) -> Result<Option<semester::Model>, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>()?;
        let db = ctx.data::<DatabaseConnection>()?;

        semester::Entity::find()
            .filter(
                semester::Column::UserId
                    .eq(&user.id)
                    .and(semester::Column::Semester.eq(semester)),
            )
            .one(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }

    pub async fn semesters(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Vec<semester::Model>, async_graphql::Error> {
        let user = ctx.data::<DatabaseUser>()?;
        let db = ctx.data::<DatabaseConnection>()?;

        semester::Entity::find()
            .filter(semester::Column::UserId.eq(&user.id))
            .all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
    }
}
