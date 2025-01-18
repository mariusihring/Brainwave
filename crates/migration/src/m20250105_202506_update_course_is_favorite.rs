use sea_orm_migration::{prelude::*, schema::*};

use crate::m20241029_123453_create_courses_table::Course;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts

        manager
            .alter_table(
                sea_query::Table::alter()
                    .table(Course::Table)
                    .add_column(boolean(Course::IsFavorite).default(false))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                sea_query::Table::alter()
                    .table(Course::Table)
                    .drop_column(Course::IsFavorite)
                    .to_owned(),
            )
            .await
    }
}
