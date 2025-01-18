use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::User, m20241029_123452_create_modules_table::Module,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Course::Table)
                    .if_not_exists()
                    .col(pk_uuid(Course::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Course::Name).not_null())
                    .col(uuid_null(Course::ModuleId))
                    .col(uuid(Course::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Courses_Module")
                            .from(Course::Table, Course::ModuleId)
                            .to(Module::Table, Module::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Courses_User")
                            .from(Course::Table, Course::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .col(float_null(Course::Grade))
                    .col(string_null(Course::Teacher))
                    .col(string_null(Course::AcademicDepartment))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Course::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Course {
    Table,
    Id,
    Name,
    ModuleId,
    UserId,
    Grade,
    Teacher,
    AcademicDepartment,
    IsFavorite,
}
