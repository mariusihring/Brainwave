use super::TodoMutation;
use crate::models::_entities::user::Model as User;
use crate::models::todo::{NewTodo, TodoTypeInput};
use crate::models::{_entities::todo, todo::UpdateTodo};
use crate::models::_entities::sea_orm_active_enums::{Todostatus, Todotype};
use async_graphql::*;
use sea_orm::{prelude::*, DatabaseConnection, EntityTrait, Set};
use uuid::Uuid;
use crate::models::_entities::{course, user};

#[Object]
impl TodoMutation {
    async fn create_todo(&self, ctx: &Context<'_>, input: NewTodo) -> Result<todo::Model> {
        let user = ctx.data::<User>().unwrap();
        let db = ctx.data::<DatabaseConnection>().unwrap();
        let id = Uuid::new_v4();

        let new_todo = todo::ActiveModel {
            id: Set(id.clone()),
            title: Set(input.title.clone()),
            due_on: Set(input.due_on.clone()),
            course_id: Set(input.course_id.clone()),
            user_id: Set(user.id.clone()),
            notes: Set(input.notes.clone()),
            r#type: Set(Into::<Todotype>::into(input.r#type)),
            status: Set(Todostatus::Inprogress)
        };

        let inserted_todo = new_todo
            .insert(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))?;
        Ok(todo::Model {
            id: inserted_todo.id,
            title: inserted_todo.title,
            due_on: inserted_todo.due_on,
            r#type: inserted_todo.r#type,
            course_id: inserted_todo.course_id,
            user_id: inserted_todo.user_id,
            notes: inserted_todo.notes,
            status: inserted_todo.status,
        })
    }

    async fn update_todo(
        &self,
        ctx: &Context<'_>,
        input: UpdateTodo,
        id: String,
    ) -> Result<todo::Model> {
        let user = ctx.data::<User>()?;
        let db = ctx.data::<DatabaseConnection>()?;

        let mut todo: todo::ActiveModel =
            todo::Entity::find_by_id(Uuid::parse_str(id.as_str()).unwrap())
                .one(db)
                .await
                .map_err(|err| async_graphql::Error::from(err))?
                .ok_or(async_graphql::Error::new("Todo not found"))?
                .into();

        todo.due_on = Set(input.due_on.clone());
        //todo.r#type = Set(input.r#type);
        todo.course_id = Set(input.course_id.clone());
        todo.title = Set(input.title.clone());
        //todo.status = Set(Todostatus::from(input.status.clone()));
        todo.notes = Set(input.notes.clone());

        let updated_todo = todo
            .update(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))?;
        Ok(todo::Model {
            id: updated_todo.id,
            title: updated_todo.title,
            due_on: updated_todo.due_on,
            r#type: updated_todo.r#type,
            course_id: updated_todo.course_id,
            user_id: updated_todo.user_id,
            notes: updated_todo.notes,
            status: updated_todo.status,
        })
    }
    //
    // pub async fn delete_todo(
    //     &self,
    //     ctx: &Context<'_>,
    //     id: Uuid
    // ) -> std::result::Result<bool, Error> {
    //     let user = ctx.data::<user::Model>().unwrap();
    //     let db = ctx.data::<DatabaseConnection>().unwrap();
    //     let res = todo::Entity::delete_by_id(id).exec(db)
    //         .await;
    //     if res.is_err() { return Ok(false) };
    //     Ok(true)
    // }
}
