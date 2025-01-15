use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Settings::Table)
                    .if_not_exists()
                    .col(pk_uuid(Settings::Id).default(Uuid::new_v4().to_string()))
                    .col(text_null(Settings::CalendarLink))
                    .col(uuid(Settings::UserId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Settings_User")
                            .from(Settings::Table, Settings::UserId)
                            .to(User::Table, User::Id).on_delete(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Settings::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Settings {
    Table,
    Id,
    CalendarLink,
    UserId,
}
