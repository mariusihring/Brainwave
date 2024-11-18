use super::_entities::sea_orm_active_enums::Todostatus;
use super::_entities::sea_orm_active_enums::Todotype;
use super::_entities::todo::ActiveModel;
use async_graphql::InputObject;
use chrono::NaiveDateTime;
use sea_orm::{ActiveModelBehavior, DeriveIntoActiveModel};
use uuid::Uuid;

impl ActiveModelBehavior for ActiveModel {}

#[derive(DeriveIntoActiveModel, InputObject)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub course_id: Option<Uuid>,
    pub r#type: String,
    pub notes: Option<String>,
}

#[derive(DeriveIntoActiveModel, InputObject)]
pub struct UpdateTodo {
    pub id: Uuid,
    pub title: String,
    pub due_on: NaiveDateTime,
    pub course_id: Option<Uuid>,
    pub r#type: String,
    pub status: String,
    pub notes: Option<String>,
}
