use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::Users, m20241029_123629_create_courses_table::Courses,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Appointments::Table)
                    .if_not_exists()
                    .col(pk_uuid(Appointments::Id).default(Uuid::new_v4().to_string()))
                    .col(date(Appointments::Date).not_null().default(Expr::current_date()))
                    .col(string(Appointments::Title))
                    .col(date_time(Appointments::StartTime).not_null().default(Expr::current_time()))
                    .col(date_time(Appointments::EndTime).not_null().default(Expr::cust("CURRENT_TIMESTAMP + INTERVAL '30 minutes'")))
                    .col(string_null(Appointments::Location))
                    .col(boolean(Appointments::IsCanceled).default(false))
                    .col(string_null(Appointments::CourseId))
                    .col(string(Appointments::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Appointments_Course")
                            .from(Appointments::Table, Appointments::CourseId)
                            .to(Courses::Table, Courses::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Appointments_User")
                            .from(Appointments::Table, Appointments::UserId)
                            .to(Users::Table, Users::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Appointments::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Appointments {
    Table,
    Id,
    Date,
    Title,
    StartTime,
    EndTime,
    Location,
    CourseId,
    UserId,
    IsCanceled,
}
