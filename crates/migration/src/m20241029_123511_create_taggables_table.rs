use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20241029_123444_create_user_table::Users, m20241029_123519_create_tags_table::Tags};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Taggables::Table)
                    .if_not_exists()
                    .col(string(Taggables::TagId).not_null())
                    .col(string(Taggables::TaggableId).not_null())
                    .col(string(Taggables::TaggableTable).not_null())
                    .col(string(Taggables::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Taggables_User")
                            .from(Taggables::Table, Taggables::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Taggables_Tags")
                            .from(Taggables::Table, Taggables::TagId)
                            .to(Tags::Table, Tags::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Taggables::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Taggables {
    Table,
    TagId,
    TaggableId,
    TaggableTable,
    UserId,
}
