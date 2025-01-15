use crate::m20241029_123444_create_user_table::User;
use crate::m20241029_123453_create_courses_table::Course;
use sea_orm::prelude::Uuid;
use sea_orm::prelude::*;
use sea_orm::sqlx::Column;
use sea_orm::{EnumIter, Iterable};
use sea_orm_migration::prelude::{sea_query::extension::postgres::Type, *};
use sea_orm_migration::{ schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(TodoType::Enum)
                    .values([TodoType::Assignment, TodoType::Exam, TodoType::General])
                    .to_owned(),
            )
            .await?;
        manager
            .create_type(
                Type::create()
                    .as_enum(TodoStatus::Enum)
                    .values([
                        TodoStatus::Completed,
                        TodoStatus::InProgress,
                        TodoStatus::Pending,
                    ])
                    .to_owned(),
            )
            .await?;

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
                    .col(uuid(Todo::UserId).not_null())
                    .col(uuid_null(Todo::CourseId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Todos_User")
                            .from(Todo::Table, Todo::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(sea_query::foreign_key::ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Todos_Course")
                            .from(Todo::Table, Todo::CourseId)
                            .to(Course::Table, Course::Id)
                            .on_delete(sea_query::foreign_key::ForeignKeyAction::Cascade),
                    )
                    .col(enumeration(Todo::Type, TodoType::Enum, TodoType::iter()))
                    .col(enumeration(
                        Todo::Status,
                        TodoStatus::Enum,
                        TodoStatus::iter(),
                    ))
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
    #[iden = "todotype"]
    Enum,
    #[iden = "assignment"]
    Assignment,
    #[iden = "exam"]
    Exam,
    #[iden = "general"]
    General,
}
#[derive(Iden, EnumIter)]
pub enum TodoStatus {
    #[iden = "todostatus"]
    Enum,
    #[iden = "pending"]
    Pending,
    #[iden = "inprogress"]
    InProgress,
    #[iden = "completed"]
    Completed,
}
