use std::env;

use sea_orm::ConnectOptions;
use sea_orm::{Database, DatabaseConnection, DbErr};

use migration::{Migrator, MigratorTrait};

pub async fn init() -> Result<DatabaseConnection, DbErr> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    let mut opt = ConnectOptions::new(database_url);
    opt.sqlx_logging(false)
        .sqlx_logging_level(log::LevelFilter::Info);

    let db = Database::connect(opt).await?;
    Migrator::up(&db, None).await.unwrap();
    Ok(db)
}

#[cfg(test)]
mod tests {}
