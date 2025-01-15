use chrono::{Duration, Utc};
use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let end_date = Utc::now() + Duration::hours(1);
        manager
            .create_table(
                Table::create()
                    .table(CalendarEntry::Table)
                    .if_not_exists()
                    .col(pk_uuid(CalendarEntry::Id).default(Uuid::new_v4().to_string()))
                    .col(string(CalendarEntry::Title).not_null())
                    .col(string(CalendarEntry::Location))
                    .col(text(CalendarEntry::Details))
                    .col(
                        date_time(CalendarEntry::StartDate)
                            .default(Expr::current_timestamp())
                            .not_null(),
                    )
                    .col(
                        date_time(CalendarEntry::EndDate)
                            .default(end_date)
                            .not_null(),
                    )
                    .col(uuid(CalendarEntry::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_CalendarEntries_User")
                            .from(CalendarEntry::Table, CalendarEntry::UserId)
                            .to(User::Table, User::Id).on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(CalendarEntry::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum CalendarEntry {
    Table,
    Id,
    Title,
    Location,
    Details,
    StartDate,
    EndDate,
    UserId,
}
