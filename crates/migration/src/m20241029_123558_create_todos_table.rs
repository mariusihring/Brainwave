use sea_orm::prelude::Uuid;
use sea_orm::{EnumIter, Iterable};
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::User;
use crate::m20241029_123629_create_courses_table::Course;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Todo::Table)
                    .if_not_exists()
                    .col(pk_uuid(Todo::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Todo::Title).not_null())
                    .col(
                        date_time(Todo::DueOn)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(string(Todo::UserId).not_null())
                    .col(string_null(Todo::CourseId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Todos_User")
                            .from(Todo::Table, Todo::UserId)
                            .to(User::Table, User::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Todos_Course")
                            .from(Todo::Table, Todo::CourseId)
                            .to(Course::Table, Course::Id),
                    )
                    .col(
                        enumeration(Todo::Type, Alias::new("type"), TodoType::iter())
                            .default("general")
                            .not_null(),
                    )
                    .col(
                        enumeration(Todo::Status, Alias::new("status"), TodoStatus::iter())
                            .default("pending")
                            .not_null(),
                    )
                    .col(text_null(Todo::Notes))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Todo::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Todo {
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
