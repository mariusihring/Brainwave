use async_graphql::{InputObject, SimpleObject};
use sqlx::prelude::FromRow;

#[derive(SimpleObject, FromRow, Debug)]
pub struct Module {
    pub id: String,
    pub name: String,
    pub ects: i32,
    pub grade: Option<f32>,
    pub start_semester: String,
    pub end_semester: String,
}

#[derive(InputObject)]
pub struct NewModule {
    pub name: String,
    pub ects: i32,
    pub grade: Option<f32>,
    pub start_semester: String,
    pub end_semester: String,
}
