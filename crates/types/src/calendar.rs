use async_graphql::{InputObject, SimpleObject};
use chrono::{NaiveDate, NaiveDateTime};

#[derive(SimpleObject, Debug)]
// #[graphql(complex)]
pub struct Appointment {
    pub id: String,
    pub date: NaiveDate,
    pub name: String,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub location: String,
}

//#[derive(InputObject)]
//pub struct NewCourse {
//    pub name: String,
//    pub grade: Option<f32>,
//    pub teacher: Option<String>,
//    pub academic_department: Option<String>,
//}
