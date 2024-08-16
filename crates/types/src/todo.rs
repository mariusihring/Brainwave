use async_graphql::{SimpleObject, InputObject};
use chrono::{NaiveDate, NaiveDateTime};
use sqlx::prelude::FromRow;


#[derive(SimpleObject, FromRow, Debug)]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub due_on: NaiveDateTime,
    pub icon: String,
    pub user_id: String
}

#[derive(InputObject)]
pub struct NewTodo {
    pub title: String,
    pub due_on: NaiveDateTime,
    pub icon: String
}