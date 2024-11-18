use async_graphql::*;

#[derive(InputObject)]
pub struct NewCourse {
    pub name: String,
    pub grade: Option<f32>,
    pub teacher: Option<String>,
    pub academic_department: Option<String>,
}
