use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123629_create_courses_table::Courses;

use super::m20241029_123444_create_user_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Flashcards::Table)
                    .if_not_exists()
                    .col(pk_uuid(Flashcards::Id))
                    .col(text(Flashcards::Question).not_null())
                    .col(text(Flashcards::Answer).not_null())
                    .col(string(Flashcards::CourseId))
                    .col(string(Flashcards::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Flashcards_Course")
                            .from(Flashcards::Table, Flashcards::CourseId)
                            .to(Courses::Table, Courses::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Flashcards_User")
                            .from(Flashcards::Table, Flashcards::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Flashcards::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Flashcards {
    Table,
    Id,
    Question,
    Answer,
    CourseId,
    UserId,
}
