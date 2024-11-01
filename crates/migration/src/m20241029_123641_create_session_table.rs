use chrono::{Duration, Utc};
use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let expires_at = Utc::now() + Duration::hours(1);
        manager
            .create_table(
                Table::create()
                    .table(Session::Table)
                    .if_not_exists()
                    .col(pk_uuid(Session::Id).default(Uuid::new_v4().to_string()))
                    .col(date_time(Session::ExpiresAt).default(expires_at))
                    .col(string(Session::UserId))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Session_User")
                            .from(Session::Table, Session::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Session::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Session {
    Table,
    Id,
    ExpiresAt,
    UserId,
}
