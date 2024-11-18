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
                    .table(Tag::Table)
                    .if_not_exists()
                    .col(pk_uuid(Tag::Id).default(Uuid::new_v4().to_string()))
                    .col(string(Tag::Name).not_null())
                    .col(string(Tag::Color))
                    .col(uuid(Tag::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Tags_User")
                            .from(Tag::Table, Tag::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Tag::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Tag {
    Table,
    Id,
    Name,
    Color,
    UserId,
}
