use crate::models::{
    _entities::{course, course::Model as CourseModel, user},
    course::NewCourse,
};
use async_graphql::{Context, Error, Object};

use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use super::CourseMutation;
use uuid::Uuid;

#[Object]
impl CourseMutation {
    pub async fn create_course(
        &self,
        ctx: &Context<'_>,
        input: NewCourse,
    ) -> Result<CourseModel, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;
        let id = Uuid::new_v4();
        let new = course::ActiveModel {
            id: Set(id),
            name: Set(input.name),
            grade: Set(input.grade),
            teacher: Set(input.teacher),
            academic_department: Set(input.academic_department),
            user_id: Set(user.id),
            ..Default::default()
        };

        new.insert(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }

    pub async fn create_multiple_courses(
        &self,
        ctx: &Context<'_>,
        input: Vec<NewCourse>,
    ) -> Result<Vec<CourseModel>, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;

        let courses: Vec<course::ActiveModel> = input
            .into_iter()
            .map(|c| course::ActiveModel {
                id: Set(Uuid::new_v4()),
                name: Set(c.name),
                grade: Set(c.grade),
                teacher: Set(c.teacher),
                academic_department: Set(c.academic_department),
                user_id: Set(user.id),
                module_id: Set(None),
                is_favorite: Set(false),
            })
            .collect();

        let course_ids: Vec<Uuid> = courses.iter().map(|c| c.id.clone().unwrap()).collect();

        course::Entity::insert_many(courses)
            .exec(db)
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let result = course::Entity::find()
            .filter(course::Column::Id.is_in(course_ids))
            .all(db)
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(result)
    }

    pub async fn update_course(
        &self,
        ctx: &Context<'_>,
        input: NewCourse,
    ) -> Result<CourseModel, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;

        let course = course::Entity::find_by_id(Uuid::parse_str(&input.id.unwrap()).unwrap())
            .one(db)
            .await?;
        let mut course: course::ActiveModel = course.unwrap().into();
        if input.module_id.is_some() {
            course.module_id = Set(Some(Uuid::parse_str(&input.module_id.unwrap()).unwrap()));
        }
        course.name = Set(input.name);
        course.academic_department = Set(input.academic_department.clone());
        course.teacher = Set(input.teacher.clone());
        course.grade = Set(input.grade);
        course.is_favorite = Set(input.is_favorite.unwrap());

        course
            .update(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }

    pub async fn delete_course(&self, ctx: &Context<'_>, id: Uuid) -> Result<bool, Error> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();
        let res = course::Entity::delete_by_id(id).exec(db).await;
        if res.is_err() {
            return Ok(false);
        };
        Ok(true)
    }
}
