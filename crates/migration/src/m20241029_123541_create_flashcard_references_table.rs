use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20241029_123444_create_user_table::Users, m20241029_123502_create_flashcards_table::Flashcards};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(FlashcardReferences::Table)
                    .if_not_exists()
                    .col(string(FlashcardReferences::FlashCardId).not_null())
                    .col(string(FlashcardReferences::ReferenceId).not_null())
                    .col(string(FlashcardReferences::ReferenceTable).not_null())
                    .col(string(FlashcardReferences::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_FlashcardReferences_User")
                            .from(FlashcardReferences::Table, FlashcardReferences::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_FlashcardReferences_Flashcards")
                            .from(FlashcardReferences::Table, FlashcardReferences::FlashCardId)
                            .to(Flashcards::Table, Flashcards::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(FlashcardReferences::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum FlashcardReferences {
    Table,
    FlashCardId,
    ReferenceId,
    ReferenceTable,
    UserId,
}
