use async_graphql::*;
use super::_entities::{course, module::Model};

#[derive(InputObject)]
pub struct NewModule {
    pub name: String,
    pub ects: i32,
    pub grade: Option<f32>,
    pub start_semester: String,
    pub end_semester: Option<String>,
}

#[ComplexObject]
impl Model {
    async fn courses(&self, ctx: &Context<'_>) -> Option<Vec<course::Model>> {
        Some(vec![])
    }
}
