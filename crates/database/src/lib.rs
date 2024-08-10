use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{ Pool,  Sqlite};
pub mod auth;

pub async fn init() -> anyhow::Result<Pool<Sqlite>> {
    
    let pool = SqlitePoolOptions::new()
    .max_connections(1)
    .connect("sqlite://auth.db")
    .await?;

    Ok(pool)
            
    
}

#[cfg(test)]
mod tests {
    use std::fs::File;

    use super::*;

    #[tokio::test]
    async fn it_works() {
        File::create("auth.db");
       let pool = init().await.expect("failed");
       sqlx::migrate!("./migrations").run(&pool).await.expect("failed to migrate");
    }
}
