use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use super::m20241029_123444_create_user_table::User;
use super::m20241029_123619_create_notebooks_table::Notebook;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Note::Table)
                    .if_not_exists()
                    .col(pk_uuid(Note::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Note::Title).not_null())
                    .col(text(Note::Content))
                    .col(string(Note::NotebookId))
                    .col(string(Note::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notes_Notebook")
                            .from(Note::Table, Note::NotebookId)
                            .to(Notebook::Table, Notebook::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notes_User")
                            .from(Note::Table, Note::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Note::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Note {
    Table,
    Id,
    Title,
    Content,
    NotebookId,
    UserId,
}
