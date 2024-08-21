use async_graphql::{InputObject, SimpleObject};
use chrono::NaiveDate;
use sqlx::prelude::FromRow;

//TODO: https://async-graphql.github.io/async-graphql/en/define_simple_object.html#user-defined-resolvers

#[derive(SimpleObject, FromRow, Debug)]
pub struct Semester {
    pub id: String,
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}

#[derive(InputObject)]
pub struct NewSemester {
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}
