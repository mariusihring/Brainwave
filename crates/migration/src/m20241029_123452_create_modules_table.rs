use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::User, m20241029_123451_create_semester_table::Semester,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Module::Table)
                    .if_not_exists()
                    .col(pk_uuid(Module::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Module::Name).not_null())
                    .col(integer(Module::ETCs).not_null())
                    .col(float_null(Module::Grade))
                    .col(uuid(Module::StartSemester).not_null())
                    .col(uuid_null(Module::EndSemester))
                    .col(uuid(Module::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Modules_StartSemester")
                            .from(Module::Table, Module::StartSemester)
                            .to(Semester::Table, Semester::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Modules_EndSemester")
                            .from(Module::Table, Module::EndSemester)
                            .to(Semester::Table, Semester::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Modules_User")
                            .from(Module::Table, Module::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Module::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Module {
    Table,
    Id,
    Name,
    ETCs,
    Grade,
    StartSemester,
    EndSemester,
    UserId,
}
