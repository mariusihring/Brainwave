use sea_orm::{prelude::Uuid};
use chrono::{Utc, Duration};
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        let end_date = Utc::now() + Duration::hours(1);
        manager
            .create_table(
                Table::create()
                    .table(CalendarEntries::Table)
                    .if_not_exists()
                    .col(pk_uuid(CalendarEntries::Id).default(Uuid::new_v4().to_string()))
                    .col(string(CalendarEntries::Title).not_null())
                    .col(string(CalendarEntries::Location))
                    .col(text(CalendarEntries::Details))
                    .col(date_time(CalendarEntries::StartDate).default(Expr::current_timestamp()).not_null())
                    .col(date_time(CalendarEntries::EndDate).default(end_date).not_null())
                    .col(string(CalendarEntries::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_CalendarEntries_User")
                            .from(CalendarEntries::Table, CalendarEntries::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(CalendarEntries::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum CalendarEntries {
    Table,
    Id,
    Title,
    Location,
    Details,
    StartDate,
    EndDate,
    UserId,
}
