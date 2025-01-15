use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::User;
use crate::m20241029_123453_create_courses_table::Course;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Notebook::Table)
                    .if_not_exists()
                    .col(pk_uuid(Notebook::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Notebook::Name).not_null())
                    .col(uuid_null(Notebook::CourseId))
                    .col(uuid(Notebook::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notebooks_Course")
                            .from(Notebook::Table, Notebook::CourseId)
                            .to(Course::Table, Course::Id).on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notebooks_User")
                            .from(Notebook::Table, Notebook::UserId)
                            .to(User::Table, User::Id).on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Notebook::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Notebook {
    Table,
    Id,
    Name,
    CourseId,
    UserId,
}
