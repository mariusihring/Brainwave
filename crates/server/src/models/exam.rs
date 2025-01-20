use super::_entities::{exam, todo, user};
use crate::models::_entities::exam::Model;
use async_graphql::*;
use chrono::{NaiveDate, Utc};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use uuid::Uuid;
use crate::models::_entities::sea_orm_active_enums::{Examtype, Todotype};
use crate::models::todo::TodoTypeInput;

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum ExamTypeInput {
    EXAM,
    HOMEASSIGNMENT,
    PRESENTATION,
}

#[derive(InputObject)]
pub struct NewExam {
    pub id: Option<String>,
    pub date: NaiveDate,
    pub grade: Option<f32>,
    pub r#type: ExamTypeInput,
    pub course_id: Option<Uuid>,
    pub details: Option<String>,
}

impl From<ExamTypeInput> for Examtype {
    fn from(value: ExamTypeInput) -> Self {
        match value {
            ExamTypeInput::EXAM => Examtype::Exam,
            ExamTypeInput::HOMEASSIGNMENT => Examtype::Homeassignment,
            ExamTypeInput::PRESENTATION => Examtype::Presentation,
        }
    }
}