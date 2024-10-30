use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::Users, m20241029_123558_create_todos_table::Todos,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TodosReference::Table)
                    .if_not_exists()
                    .col(pk_uuid(TodosReference::Id).default(Uuid::new_v4().to_string()))
                    .col(string(TodosReference::TodoId).not_null())
                    .col(string(TodosReference::ReferenceId).not_null())
                    .col(string(TodosReference::ReferenceTable).not_null())
                    .col(string(TodosReference::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_TodoReference_Todo")
                            .from(TodosReference::Table, TodosReference::TodoId)
                            .to(Todos::Table, Todos::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_TodoReference_User")
                            .from(TodosReference::Table, TodosReference::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TodosReference::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum TodosReference {
    Table,
    Id,
    TodoId,
    ReferenceId,
    ReferenceTable,
    UserId,
}
