use crate::{graphql::semester::SemesterMutation, models::semester::NewSemester};
use crate::models::_entities::{semester, user};
use async_graphql::{Context, Error, Object};

use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr, DeleteResult, EntityTrait, Set, SqlErr};

use uuid::Uuid;

#[Object]
impl SemesterMutation {
    pub async fn create_semester(
        &self,
        ctx: &Context<'_>,
        input: NewSemester,
    ) -> Result<semester::Model, async_graphql::Error> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();
        let id = Uuid::new_v4();

        let semester_hash = format!("semester_{}_{}",  input.semester.clone(), user.id.clone());
        let new = semester::ActiveModel {
            id: Set(id),
            semester_hash: Set(semester_hash),
            semester: Set(input.semester),
            start_date: Set(input.start_date),
            end_date: Set(input.end_date),
            user_id: Set(user.id),
            total_ec_ts: Set(input.total_ects),
            ..Default::default()
        };

        //TODO: return propper error if the semester allready exists
        new.insert(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }

    pub async fn delete_semester(
        &self,
        ctx: &Context<'_>,
        id: Uuid
    ) -> Result<bool, Error> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();
        let res = semester::Entity::delete_by_id(id).exec(db)
            .await;
        if res.is_err() {
            println!("{:?}", res);
            return Ok(false) };
        Ok(true)
    }
}
