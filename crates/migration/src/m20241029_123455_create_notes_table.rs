use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use super::m20241029_123444_create_user_table::Users;
use super::m20241029_123619_create_notebooks_table::Notebooks;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Notes::Table)
                    .if_not_exists()
                    .col(pk_uuid(Notes::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Notes::Title).not_null())
                    .col(text(Notes::Content))
                    .col(string(Notes::NotebookId))
                    .col(string(Notes::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notes_Notebook")
                            .from(Notes::Table, Notes::NotebookId)
                            .to(Notebooks::Table, Notebooks::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notes_User")
                            .from(Notes::Table, Notes::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Notes::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Notes {
    Table,
    Id,
    Title,
    Content,
    NotebookId,
    UserId,
}
