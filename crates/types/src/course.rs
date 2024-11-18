use async_graphql::{InputObject, SimpleObject};

#[derive(SimpleObject, Debug)]
// #[graphql(complex)]
//TODO: add module resolver with  complex
pub struct Course {
    pub id: String,
    pub name: String,
    pub grade: Option<f32>,
    pub teacher: Option<String>,
    pub academic_department: Option<String>,
}

#[derive(InputObject)]
pub struct NewCourse {
    pub name: String,
    pub grade: Option<f32>,
    pub teacher: Option<String>,
    pub academic_department: Option<String>,
}
