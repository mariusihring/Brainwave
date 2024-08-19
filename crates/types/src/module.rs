use async_graphql::{InputObject, SimpleObject};
use sqlx::prelude::FromRow;

#[derive(SimpleObject, FromRow, Debug)]
pub struct Module {
    pub id: String,
    pub title: String,
    pub ects: i32,
    pub grade: f32,
    pub start_semester: String, //TODO: make foreign key
    pub end_semester: String,
}

#[derive(InputObject)]
pub struct NewModule {
    pub title: String,
    pub ects: i32,
    pub grade: f32,
    pub start_semester: String, //TODO: make foreign key
    pub end_semester: String,
}
