use extension::postgres::Type;
use sea_orm::{prelude::Uuid, EnumIter, Iterable};
use sea_orm_migration::{prelude::*, schema::*};

use crate::{
    m20241029_123444_create_user_table::User, m20241029_123453_create_courses_table::Course,
};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(ExamType::Enum)
                    .values([
                        ExamType::Exam,
                        ExamType::HomeAssignment,
                        ExamType::Presentation,
                    ])
                    .to_owned(),
            )
            .await?;
        manager
            .create_table(
                Table::create()
                    .table(Exam::Table)
                    .if_not_exists()
                    .col(pk_uuid(Exam::Id).default(Uuid::new_v4().to_string()))
                    .col(date(Exam::Date).default(Expr::current_date()))
                    .col(uuid(Exam::CourseId))
                    .col(uuid(Exam::UserId))
                    .col(enumeration(Exam::Type, ExamType::Enum, ExamType::iter()))
                    .col(float_null(Exam::Grade))
                    .col(text_null(Exam::Details))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Exam_Course")
                            .from(Exam::Table, Exam::CourseId)
                            .to(Course::Table, Course::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_Exam_User")
                            .from(Exam::Table, Exam::UserId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Exam::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Exam {
    Table,
    Id,
    Date,
    CourseId,
    UserId,
    Grade,
    Type,
    Details,
}
#[derive(Iden, EnumIter)]
pub enum ExamType {
    #[iden = "examtype"]
    Enum,
    #[iden = "exam"]
    Exam,
    #[iden = "homeassignment"]
    HomeAssignment,
    #[iden = "presentation"]
    Presentation,
}
