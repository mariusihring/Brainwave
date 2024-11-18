use crate::models::{_entities::{course::Model as Course, user}, course::NewCourse};
use async_graphql::{Context, Object};

use sea_orm::DatabaseConnection;

use uuid::Uuid;

use super::CourseMutation;

#[Object]
impl CourseMutation {
    pub async fn create_course(
        &self,
        ctx: &Context<'_>,
        input: NewCourse,
    ) -> Result<Course, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;
        let id = Uuid::new_v4();

        Ok(Course {
            id,
            name: "test".into(),
            grade: None,
            teacher: None,
            academic_department: None,
            module_id: id,
            user_id: user.id,
        })
    }

    pub async fn create_multiple_courses(
        &self,
        ctx: &Context<'_>,
        input: Vec<String>,
    ) -> Result<Vec<Course>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<&user::Model>()?;
        let mut response = Vec::new();
        for course_name in input {
            let id = Uuid::new_v4();

            let course = Course {
                id,
                name: course_name.clone(),
                grade: None,
                teacher: None,
                academic_department: None,
                module_id: id,
                user_id: user.id,
            };
            response.push(course);
        }
        Ok(response)
    }
}
