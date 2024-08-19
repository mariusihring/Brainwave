use crate::graphql::semester::SemesterMutation;
use async_graphql::Object;
use types::semester::Semester;

#[Object]
impl SemesterMutation {
    pub async fn createSemester(&self, id: String) -> Option<Semester> {
        Some(Semester {
            id,
            semester: 0,
            start_date: Default::default(),
            end_date: Default::default(),
            total_ects: 0,
        })
    }
}
