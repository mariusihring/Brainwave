use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123629_create_courses_table::Course;

use super::m20241029_123444_create_user_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Flashcard::Table)
                    .if_not_exists()
                    .col(pk_uuid(Flashcard::Id).default(Uuid::new_v4().to_string()))
                    .col(text(Flashcard::Question).not_null())
                    .col(text(Flashcard::Answer).not_null())
                    .col(string(Flashcard::CourseId))
                    .col(string(Flashcard::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Flashcards_Course")
                            .from(Flashcard::Table, Flashcard::CourseId)
                            .to(Course::Table, Course::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Flashcards_User")
                            .from(Flashcard::Table, Flashcard::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Flashcard::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Flashcard {
    Table,
    Id,
    Question,
    Answer,
    CourseId,
    UserId,
}
