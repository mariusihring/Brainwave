use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Sqlite};

pub async fn init(path: &str) -> anyhow::Result<Pool<Sqlite>> {
    let pool = SqlitePoolOptions::new()
        .max_connections(10)
        .connect(format!("sqlite://{}", path).as_str())
        .await?;
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("failed to migrate");
    Ok(pool)
}

#[cfg(test)]
mod tests {
    use std::fs::File;

    use super::*;

    #[tokio::test]
    async fn it_works() {
        File::create("auth.db");
        let pool = init("").await.expect("failed");
        sqlx::migrate!("./migrations")
            .run(&pool)
            .await
            .expect("failed to migrate");
    }
}
