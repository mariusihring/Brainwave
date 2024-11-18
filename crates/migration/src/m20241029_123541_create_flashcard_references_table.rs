use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::User, m20241029_123502_create_flashcards_table::Flashcard,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(FlashcardReference::Table)
                    .if_not_exists()
                    .col(pk_uuid(FlashcardReference::Id).default(Uuid::new_v4().to_string()))
                    .col(uuid(FlashcardReference::FlashCardId).not_null())
                    .col(uuid(FlashcardReference::ReferenceId).not_null())
                    .col(string(FlashcardReference::ReferenceTable).not_null())
                    .col(uuid(FlashcardReference::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_FlashcardReferences_User")
                            .from(FlashcardReference::Table, FlashcardReference::UserId)
                            .to(User::Table, User::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_FlashcardReferences_Flashcards")
                            .from(FlashcardReference::Table, FlashcardReference::FlashCardId)
                            .to(Flashcard::Table, Flashcard::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(FlashcardReference::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum FlashcardReference {
    Table,
    Id,
    FlashCardId,
    ReferenceId,
    ReferenceTable,
    UserId,
}
