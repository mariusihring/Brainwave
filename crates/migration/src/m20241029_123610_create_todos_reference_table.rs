use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20241029_123444_create_user_table::User, m20241029_123558_create_todos_table::Todo};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TodoReference::Table)
                    .if_not_exists()
                    .col(pk_uuid(TodoReference::Id).default(Uuid::new_v4().to_string()))
                    .col(uuid(TodoReference::TodoId).not_null())
                    .col(uuid(TodoReference::ReferenceId).not_null())
                    .col(string(TodoReference::ReferenceTable).not_null())
                    .col(uuid(TodoReference::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_TodoReference_Todo")
                            .from(TodoReference::Table, TodoReference::TodoId)
                            .to(Todo::Table, Todo::Id).on_delete(ForeignKeyAction::Cascade)
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_TodoReference_User")
                            .from(TodoReference::Table, TodoReference::UserId)
                            .to(User::Table, User::Id).on_delete(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TodoReference::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum TodoReference {
    Table,
    Id,
    TodoId,
    ReferenceId,
    ReferenceTable,
    UserId,
}
