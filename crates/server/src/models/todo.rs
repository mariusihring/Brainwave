use std::str::FromStr;

use super::_entities::todo::ActiveModel;
use async_graphql::Enum;
use async_graphql::InputObject;
use chrono::NaiveDateTime;
use sea_orm::ActiveValue;
use sea_orm::IntoActiveValue;
use sea_orm::{ActiveModelBehavior, DeriveIntoActiveModel, EnumIter, Iden};

impl ActiveModelBehavior for ActiveModel {}

#[derive(DeriveIntoActiveModel, InputObject)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub course_id: Option<String>,
    pub r#type: TodoType,
    pub notes: Option<String>,
}

#[derive(DeriveIntoActiveModel, InputObject)]
pub struct UpdateTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub course_id: Option<String>,
    pub r#type: TodoType,
    pub status: TodoStatus,
    pub notes: Option<String>,
}

#[derive(Iden, EnumIter, Enum, Copy, Clone, Eq, PartialEq, Debug)]
pub enum TodoType {
    #[graphql(name = "assignment")]
    #[iden = "assignment"]
    Assignment,
    #[graphql(name = "exam")]
    #[iden = "exam"]
    Exam,
    #[graphql(name = "general")]
    #[iden = "general"]
    General,
}

#[derive(Iden, EnumIter, Enum, Copy, Clone, Eq, PartialEq, Debug)]
pub enum TodoStatus {
    #[graphql(name = "pending")]
    #[iden = "pending"]
    Pending,
    #[graphql(name = "inprogress")]
    #[iden = "inprogress"]
    InProgress,
    #[graphql(name = "completed")]
    #[iden = "completed"]
    Completed,
}

// Implement IntoActiveValue for TodoType
impl IntoActiveValue<String> for TodoType {
    fn into_active_value(self) -> ActiveValue<String> {
        ActiveValue::Set({
            let this = &self;
            let mut s = String::new();
            self.unquoted(&mut s);
            s
        })
    }
}

// Implement Display trait to provide string representation for TodoType
impl std::fmt::Display for TodoType {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                TodoType::Assignment => "assignment",
                TodoType::Exam => "exam",
                TodoType::General => "general",
            }
        )
    }
}

// Implement IntoActiveValue for TodoStatus
impl IntoActiveValue<String> for TodoStatus {
    fn into_active_value(self) -> ActiveValue<String> {
        ActiveValue::Set(self.to_string())
    }
}

// Implement Display trait to provide string representation for TodoStatus
impl std::fmt::Display for TodoStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                TodoStatus::Pending => "pending",
                TodoStatus::InProgress => "inprogress",
                TodoStatus::Completed => "completed",
            }
        )
    }
}

impl TodoStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            TodoStatus::Pending => "pending",
            TodoStatus::InProgress => "inprogress",
            TodoStatus::Completed => "completed",
        }
    }
}

impl FromStr for TodoStatus {
    type Err = ();

    fn from_str(input: &str) -> Result<TodoStatus, Self::Err> {
        match input {
            "pending" => Ok(TodoStatus::Pending),
            "inprogress" => Ok(TodoStatus::InProgress),
            "completed" => Ok(TodoStatus::Completed),
            _ => Err(()),
        }
    }
}

impl TodoType {
    pub fn as_str(&self) -> &'static str {
        match self {
            TodoType::Assignment => "assignment",
            TodoType::Exam => "exam",
            TodoType::General => "general",
        }
    }
}

impl FromStr for TodoType {
    type Err = ();

    fn from_str(input: &str) -> Result<TodoType, Self::Err> {
        match input {
            "assignment" => Ok(TodoType::Assignment),
            "exam" => Ok(TodoType::Exam),
            "general" => Ok(TodoType::General),
            _ => Err(()),
        }
    }
}
