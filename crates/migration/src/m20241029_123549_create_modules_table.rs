use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Modules::Table)
                    .if_not_exists()
                    .col(pk_uuid(Modules::Id))
                    .col(string(Modules::Name).not_null())
                    .col(integer(Modules::ETCs).not_null())
                    .col(float_null(Modules::Grade))
                    .col(string(Modules::StartSemester).not_null())
                    .col(string_null(Modules::EndSemester))
                    .col(string(Modules::UserId).not_null())
                    .foreign_key(ForeignKey::create().name("FK_Modules_StartSemester").from(Modules::Table, Modules::StartSemester).to(Semesters::Table, Semesters::Id))
                    .foreign_key(ForeignKey::create().name("FK_Modules_EndSemester").from(Modules::Table, Modules::EndSemester).to(Semesters::Table, Semesters::Id))
                    .foreign_key(ForeignKey::create().name("FK_Modules_User").from(Modules::Table, Modules::UserId).to(Users::Table, Users::Id))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Modules::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Modules {
    Table,
    Id,
    Name,
    ETCs,
    Grade,
    StartSemester,
    EndSemester,
    UserId
}
