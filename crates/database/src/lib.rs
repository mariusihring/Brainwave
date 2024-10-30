use sea_orm::ConnectOptions;
use sea_orm::{Database, DbErr, DatabaseConnection};

use migration::{Migrator, MigratorTrait};
pub mod models;

pub async fn init(path: &str) -> Result<DatabaseConnection, DbErr> {
    let mut opt = ConnectOptions::new(format!("sqlite://{}?mode=rwc", path).as_str());
    opt.sqlx_logging(false).sqlx_logging_level(log::LevelFilter::Info);

    let db = Database::connect(opt).await?;
    Migrator::up(&db, None).await.unwrap();
    Ok(db)
}

#[cfg(test)]
mod tests {}
