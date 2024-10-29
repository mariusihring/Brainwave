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
                    .table(Notebooks::Table)
                    .if_not_exists()
                    .col(pk_uuid(Notebooks::Id))
                    .col(string(Notebooks::Name).not_null())
                    .col(string(Notebooks::CourseId))
                    .col(string(Notebooks::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notebooks_Course")
                            .from(Notebooks::Table, Notebooks::CourseId)
                            .to(Courses::Table, Courses::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Notebooks_User")
                            .from(Notebooks::Table, Notebooks::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Notebooks::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Notebooks {
    Table,
    Id,
    Name,
    CourseId,
    UserId,
}
