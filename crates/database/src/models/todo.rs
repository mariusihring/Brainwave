use sea_orm::entity::prelude::*;
use chrono::NaiveDateTime;
use super::_entities::todos::ActiveModel;
use async_graphql::{Enum, InputObject};

impl ActiveModelBehavior for ActiveModel {

}



//Input Type
#[derive(DeriveIntoActiveModel, InputObject)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub user_id: String,
    pub course_id: Option<String>,
    pub r#type: TodoType,
    pub notes: Option<String>,
}



#[derive(Copy, Clone, Enum, Eq, PartialEq,EnumIter, DeriveActiveEnum,)]
// #[sea_orm(rs_type = "String", db_type = "String(StringLen::N(20))")]
#[sea_orm(rs_type = "String", db_type = "Text")]
pub enum TodoType {
    #[sea_orm(string_value = "assignment")]
    Assignment,
    #[sea_orm(string_value = "exam")]
    Exam,
    #[sea_orm(string_value = "general")]
    General
}