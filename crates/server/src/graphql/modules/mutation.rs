use crate::graphql::modules::ModuleMutation;
use crate::models::_entities::{module, semester, user};
use crate::models::module::NewModule;
use async_graphql::{Context, Object};
use sea_orm::Set;
use sea_orm::{ActiveModelTrait, DatabaseConnection};
use uuid::Uuid;

#[Object]
impl ModuleMutation {
    pub async fn create_module(
        &self,
        ctx: &Context<'_>,
        input: NewModule,
    ) -> Result<module::Model, async_graphql::Error> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<user::Model>()?;
        let id = Uuid::new_v4();

        let module = module::ActiveModel {
            id: Set(id),
            name: Set(input.name),
            et_cs: Set(input.ects),
            grade: Set(input.grade),
            start_semester: Set(Uuid::parse_str(input.start_semester.as_str()).unwrap()),
            end_semester: Set(None),
            user_id: Set(user.id),
        };

        module
            .insert(db)
            .await
            .map_err(|e| async_graphql::Error::new(format!("Database Error: {:?}", e)))
    }
}
