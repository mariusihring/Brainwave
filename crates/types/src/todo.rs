use async_graphql::{Enum, InputObject, SimpleObject};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use sqlx::Type;
use std::fmt;
use std::str::FromStr;

#[derive(SimpleObject, FromRow, Debug)]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub due_on: NaiveDateTime,
    pub user_id: String,
    pub course_id: Option<String>,
    #[sqlx(rename = "type")]
    pub todo_type: TodoType,
}

#[derive(InputObject, FromRow)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub icon: String,
    pub course_id: Option<String>,
    #[sqlx(rename = "type")]
    pub todo_type: Option<TodoType>,
}

#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize, Deserialize, Enum, Copy)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum TodoType {
    Assignment,
    Exam,
    General,
}

impl FromStr for TodoType {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "assignment" => Ok(TodoType::Assignment),
            "exam" => Ok(TodoType::Exam),
            "general" => Ok(TodoType::General),
            _ => Err(format!("Unknown TodoType: {}", s)),
        }
    }
}
impl fmt::Display for TodoType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            TodoType::Assignment => write!(f, "assignment"),
            TodoType::Exam => write!(f, "exam"),
            TodoType::General => write!(f, "general"),
        }
    }
}
