use crate::course::Course;
use async_graphql::{ComplexObject, Context, InputObject, SimpleObject};
use sqlx::prelude::FromRow;

#[derive(SimpleObject, FromRow, Debug)]
#[graphql(complex)]
pub struct Module {
    pub id: String,
    pub name: String,
    pub ects: i32,
    pub grade: Option<f32>,
    pub start_semester: String,
    pub end_semester: Option<String>,
    //TODO: make courses queryable with the complex query
}

#[derive(InputObject)]
pub struct NewModule {
    pub name: String,
    pub ects: i32,
    pub grade: Option<f32>,
    pub start_semester: String,
    pub end_semester: Option<String>,
}

#[ComplexObject]
impl Module {
    async fn courses(&self, ctx: &Context<'_>) -> Option<Vec<Course>> {
        Some(vec![])
    }
}
