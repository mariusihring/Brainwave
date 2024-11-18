use sea_orm::ConnectOptions;
use sea_orm::{Database, DatabaseConnection, DbErr};

use migration::{Migrator, MigratorTrait};

pub async fn init(path: &str) -> Result<DatabaseConnection, DbErr> {
    let mut opt = ConnectOptions::new("postgresql://BrainwaveRoot:kBx9H8w9oJsyZDjmJREsAYUpjvQhgKoMYsD8VLB6JyiUbDn@128.140.123.38:5432/Brainwave");
    opt.sqlx_logging(false)
        .sqlx_logging_level(log::LevelFilter::Info);

    let db = Database::connect(opt).await?;
    Migrator::up(&db, None).await.unwrap();
    Ok(db)
}

#[cfg(test)]
mod tests {}
