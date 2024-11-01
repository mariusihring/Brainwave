use chrono::{Duration, Utc};
use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123444_create_user_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let end_date = Utc::now() + Duration::days(180);
        manager
            .create_table(
                Table::create()
                    .table(Semester::Table)
                    .if_not_exists()
                    .col(pk_uuid(Semester::Id).default(Uuid::new_v4().to_string()))
                    .col(string_uniq(Semester::SemesterHash).not_null())
                    .col(integer(Semester::Semester).not_null())
                    .col(
                        date(Semester::StartDate)
                            .not_null()
                            .default(Expr::current_date()),
                    )
                    .col(date(Semester::EndDate).not_null().default(end_date))
                    .col(string(Semester::UserId).not_null())
                    .col(boolean(Semester::ImportedAppointments).default(false))
                    .col(integer(Semester::TotalECTs).default(0))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Semesters_User")
                            .from(Semester::Table, Semester::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Semester::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Semester {
    Table,
    Id,
    SemesterHash,
    Semester,
    StartDate,
    EndDate,
    ImportedAppointments,
    TotalECTs,
    UserId,
}
