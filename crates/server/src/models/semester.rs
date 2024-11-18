use super::_entities::{course, module, semester::Model};
use async_graphql::*;
use chrono::NaiveDate;

#[ComplexObject]
impl Model {
    async fn courses( &self,
        ctx: &Context<'_>,
        ) -> Vec<course::Model> {
            vec![]
        }

        async fn modules( &self,
            ctx: &Context<'_>,
            ) -> Vec<module::Model> {
                vec![]
            }
}

#[derive(InputObject)]
pub struct NewSemester {
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}