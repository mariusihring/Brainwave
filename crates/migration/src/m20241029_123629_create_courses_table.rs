use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::Users, m20241029_123549_create_modules_table::Modules,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Courses::Table)
                    .if_not_exists()
                    .col(pk_uuid(Courses::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Courses::Name).not_null())
                    .col(string(Courses::ModuleId).not_null())
                    .col(string(Courses::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Courses_Module")
                            .from(Courses::Table, Courses::ModuleId)
                            .to(Modules::Table, Modules::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Courses_User")
                            .from(Courses::Table, Courses::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .col(float_null(Courses::Grade))
                    .col(string_null(Courses::Teacher))
                    .col(string_null(Courses::AcademicDepartment))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Courses::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Courses {
    Table,
    Id,
    Name,
    ModuleId,
    UserId,
    Grade,
    Teacher,
    AcademicDepartment,
}
