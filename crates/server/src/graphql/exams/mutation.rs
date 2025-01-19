use crate::models::{
    _entities::{exam, exam::Model as ExamModel, user},
    exam::NewExam,
};
use async_graphql::{Context, Error, Object};

use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};

use crate::models::_entities::semester;
use uuid::Uuid;
use crate::models::_entities::sea_orm_active_enums::{Examtype, Todotype};
use super::ExamMutation;

#[Object]
impl ExamMutation {
    pub async fn create_exam(
        &self,
        ctx: &Context<'_>,
        input: NewExam,
    ) -> Result<ExamModel, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;
        let id = Uuid::new_v4();
        let new = exam::ActiveModel {
            id: Set(id),
            date: Set(input.date),
            grade: Set(input.grade),
            r#type: Set(Into::<Examtype>::into(input.r#type)),
            details: Set(input.details),
            user_id: Set(user.id),
            course_id: Set(input.course_id),
            ..Default::default()
        };

        new.insert(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }

    pub async fn update_exam(
        &self,
        ctx: &Context<'_>,
        input: NewExam,
    ) -> Result<ExamModel, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;

        let exam = exam::Entity::find_by_id(Uuid::parse_str(&input.id.unwrap()).unwrap())
            .one(db)
            .await?;
        let mut exam: exam::ActiveModel = exam.unwrap().into();
        if input.course_id.is_some() {
            exam.course_id = Set(Some(input.course_id.unwrap()));
        }
        exam.date = Set(input.date.clone());
        exam.grade = Set(input.grade.clone());
        exam.r#type = Set(Into::<Examtype>::into(input.r#type));
        exam.details = Set(input.details);

        exam
            .update(db)
            .await
            .map_err(|e| async_graphql::Error::from(e))
    }

    pub async fn delete_exam(&self, ctx: &Context<'_>, id: Uuid) -> Result<bool, Error> {
        let user = ctx.data::<user::Model>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();
        let res = exam::Entity::delete_by_id(id).exec(db).await;
        if res.is_err() {
            return Ok(false);
        };
        Ok(true)
    }
}
