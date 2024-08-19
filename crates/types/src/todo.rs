use std::fmt;

use async_graphql::{Enum, InputObject, SimpleObject};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(SimpleObject, FromRow, Debug)]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub due_on: NaiveDateTime,
    pub user_id: String,
    pub course_id: Option<String>,
    pub todo_type: TodoType,
}

#[derive(InputObject)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub icon: String,
    pub course_id: Option<String>,
    pub todo_type: Option<TodoType>,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq, Debug, sqlx::Type, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TodoType {
    Assignment,
    Exam,
    General,
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
