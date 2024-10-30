use sea_orm::prelude::Uuid;
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
                    .table(Semesters::Table)
                    .if_not_exists()
                    .col(pk_uuid(Semesters::Id).default(Uuid::new_v4().to_string()))
                    .col(string_uniq(Semesters::SemesterHash).not_null())
                    .col(integer(Semesters::Semester).not_null())
                    .col(date(Semesters::StartDate).not_null().default(Expr::current_date()))
                    .col(date(Semesters::EndDate).not_null().default(Expr::cust("CURRENT_TIMESTAMP + INTERVAL '6 months'")))
                    .col(string(Semesters::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Semesters_User")
                            .from(Semesters::Table, Semesters::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Semesters::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Semesters {
    Table,
    Id,
    SemesterHash,
    Semester,
    StartDate,
    EndDate,
    TotalECTs,
    UserId,
}
