use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20241029_123444_create_user_table::User, m20241029_123510_create_tags_table::Tag};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Taggable::Table)
                    .if_not_exists()
                    .col(pk_uuid(Taggable::Id).default(Uuid::new_v4().to_string()))
                    .col(uuid(Taggable::TagId))
                    .col(uuid(Taggable::TaggableId).not_null())
                    .col(string(Taggable::TaggableTable).not_null())
                    .col(uuid(Taggable::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Taggables_User")
                            .from(Taggable::Table, Taggable::UserId)
                            .to(User::Table, User::Id).on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Taggables_Tags")
                            .from(Taggable::Table, Taggable::TagId)
                            .to(Tag::Table, Tag::Id).on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Taggable::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Taggable {
    Table,
    Id,
    TagId,
    TaggableId,
    TaggableTable,
    UserId,
}
