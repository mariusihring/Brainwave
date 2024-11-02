use crate::{
    m20241029_123444_create_user_table::User, m20241029_123453_create_courses_table::Course,
};
use chrono::{Duration, Utc};
use sea_orm::prelude::Uuid;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let end_date = Utc::now() + Duration::days(180);
        manager
            .create_table(
                Table::create()
                    .table(Appointment::Table)
                    .if_not_exists()
                    .col(pk_uuid(Appointment::Id).default(Uuid::new_v4().to_string()))
                    .col(
                        date(Appointment::Date)
                            .not_null()
                            .default(Expr::current_date()),
                    )
                    .col(string(Appointment::Title))
                    .col(
                        date_time(Appointment::StartTime)
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(date_time(Appointment::EndTime).not_null().default(end_date))
                    .col(string_null(Appointment::Location))
                    .col(boolean(Appointment::IsCanceled).default(false))
                    .col(uuid_null(Appointment::CourseId))
                    .col(uuid(Appointment::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Appointments_Course")
                            .from(Appointment::Table, Appointment::CourseId)
                            .to(Course::Table, Course::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Appointments_User")
                            .from(Appointment::Table, Appointment::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Appointment::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Appointment {
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
