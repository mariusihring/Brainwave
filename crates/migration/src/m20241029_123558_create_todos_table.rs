use sea_orm::{EnumIter, Iterable};
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::Users;
use crate::m20241029_123629_create_courses_table::Courses;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Todos::Table)
                    .if_not_exists()
                    .col(pk_uuid(Todos::Id))
                    .col(string(Todos::Title).not_null())
                    .col(date_time(Todos::DueOn).not_null())
                    .col(string(Todos::UserId).not_null())
                    .col(string_null(Todos::CourseId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Todos_User")
                            .from(Todos::Table, Todos::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Todos_Course")
                            .from(Todos::Table, Todos::UserId)
                            .to(Courses::Table, Courses::Id),
                    )
                    .col(
                        enumeration(Todos::Type, Alias::new("type"), TodoType::iter())
                            .default("general")
                            .not_null(),
                    )
                    .col(
                        enumeration(Todos::Status, Alias::new("status"), TodoStatus::iter())
                            .default("pending")
                            .not_null(),
                    )
                    .col(text_null(Todos::Notes))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Todos::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Todos {
    Table,
    Id,
    Title,
    DueOn,
    UserId,
    CourseId,
    Type,
    Status,
    Notes,
}

#[derive(Iden, EnumIter)]
pub enum TodoType {
    #[iden = "assignment"]
    Assignment,
    #[iden = "exam"]
    Exam,
    #[iden = "general"]
    General,
}
#[derive(Iden, EnumIter)]
pub enum TodoStatus {
    #[iden = "pending"]
    Pending,
    #[iden = "inprogress"]
    InProgress,
    #[iden = "completed"]
    Completed,
}
