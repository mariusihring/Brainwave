use async_graphql::*;

#[derive(InputObject)]
pub struct NewCourse {
    pub id: Option<String>,
    pub name: String,
    pub grade: Option<f32>,
    pub teacher: Option<String>,
    pub academic_department: Option<String>,
    pub module_id: Option<String>,
}
