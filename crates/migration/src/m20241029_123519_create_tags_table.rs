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
                    .table(Tags::Table)
                    .if_not_exists()
                    .col(pk_uuid(Tags::Id))
                    .col(string(Tags::Name).not_null())
                    .col(string(Tags::Color))
                    .col(string(Tags::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Tags_User")
                            .from(Tags::Table, Tags::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Tags::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Tags {
    Table,
    Id,
    Name,
    Color,
    UserId,
}
