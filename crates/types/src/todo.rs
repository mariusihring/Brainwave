use crate::course::Course;
use crate::user::DatabaseUser;
use async_graphql::{ComplexObject, Context, Enum, InputObject, SimpleObject};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use sqlx::{Pool, Sqlite, Type};
use std::fmt;
use std::str::FromStr;

#[derive(SimpleObject, FromRow, Debug)]
#[graphql(complex)]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub due_on: NaiveDateTime,
    pub user_id: String,
    #[graphql(skip)]
    pub course_id: Option<String>,
    #[sqlx(rename = "type")]
    pub todo_type: TodoType,
    pub status: TodoStatus,
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
pub enum TodoStatus {
    Pending,
    InProgress,
    Completed,
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

impl FromStr for TodoStatus {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "pending" => Ok(TodoStatus::Pending),
            "inprogress" => Ok(TodoStatus::InProgress),
            "completed" => Ok(TodoStatus::Completed),
            _ => Err(format!("Unknown TodoStatus: {}", s)),
        }
    }
}
impl fmt::Display for TodoStatus {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            TodoStatus::Pending => write!(f, "pending"),
            TodoStatus::InProgress => write!(f, "inprogress"),
            TodoStatus::Completed => write!(f, "completed"),
        }
    }
}

#[ComplexObject]
impl Todo {
    async fn course(&self, ctx: &Context<'_>) -> Option<Course> {
        let course_id = &self.course_id;
        let user = ctx.data::<DatabaseUser>().expect("failed to get db conn");
        let db = ctx.data::<Pool<Sqlite>>().expect("failed to get user");
        if let Some(id) = course_id {
            let course = sqlx::query_as::<_, Course>("SELECT * FROM courses WHERE id = ?")
                .bind(id)
                .fetch_optional(db)
                .await
                .map_err(|err| async_graphql::Error::from(err))
                .expect("failed to get corresponding course");
            return course;
        }
        None
    }
}
