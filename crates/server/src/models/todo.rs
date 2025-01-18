use super::_entities::sea_orm_active_enums::Todostatus;
use super::_entities::sea_orm_active_enums::Todotype;
use super::_entities::todo::ActiveModel;
use async_graphql::{Enum, InputObject};
use chrono::NaiveDateTime;
use sea_orm::ActiveValue;
use sea_orm::ActiveValue::NotSet;
use sea_orm::{ActiveModelBehavior, DeriveIntoActiveModel};
use uuid::Uuid;

impl ActiveModelBehavior for ActiveModel {}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum TodoTypeInput {
    ASSIGNMENT,
    EXAM,
    GENERAL,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum TodoStatusInput {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
}

#[derive(InputObject)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub course_id: Option<Uuid>,
    pub r#type: TodoTypeInput,
    pub notes: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateTodo {
    pub id: Uuid,
    pub title: String,
    pub due_on: NaiveDateTime,
    pub course_id: Option<Uuid>,
    pub r#type: TodoTypeInput,
    pub status: TodoStatusInput,
    pub notes: Option<String>,
}

impl From<TodoTypeInput> for Todotype {
    fn from(value: TodoTypeInput) -> Self {
        match value {
            TodoTypeInput::ASSIGNMENT => Todotype::Assignment,
            TodoTypeInput::EXAM => Todotype::Exam,
            TodoTypeInput::GENERAL => Todotype::General,
        }
    }
}

impl From<TodoStatusInput> for Todostatus {
    fn from(value: TodoStatusInput) -> Self {
        match value {
            TodoStatusInput::PENDING => Todostatus::Completed,
            TodoStatusInput::IN_PROGRESS => Todostatus::Inprogress,
            TodoStatusInput::COMPLETED => Todostatus::Pending,
        }
    }
}

impl From<NewTodo> for ActiveModel {
    fn from(input: NewTodo) -> Self {
        Self {
            id: ActiveValue::Set(Uuid::new_v4()),
            user_id: NotSet,
            title: ActiveValue::Set(input.title),
            due_on: ActiveValue::Set(input.due_on),
            course_id: ActiveValue::Set(input.course_id),
            r#type: ActiveValue::Set(input.r#type.into()),
            status: ActiveValue::Set(Todostatus::Pending), // Default status for new todos
            notes: ActiveValue::Set(input.notes),
        }
    }
}

impl From<UpdateTodo> for ActiveModel {
    fn from(input: UpdateTodo) -> Self {
        Self {
            id: ActiveValue::Set(input.id),
            title: ActiveValue::Set(input.title),
            due_on: ActiveValue::Set(input.due_on),
            course_id: ActiveValue::Set(input.course_id),
            r#type: ActiveValue::Set(input.r#type.into()),
            status: ActiveValue::Set(input.status.into()),
            notes: ActiveValue::Set(input.notes),
            user_id: NotSet,
        }
    }
}

/*
export type TodoStatus =
  | 'COMPLETED'
  | 'INPROGRESS'
  | 'PENDING';

export type TodoType =
  | 'ASSIGNMENT'
  | 'EXAM'
  | 'GENERAL';

*/
