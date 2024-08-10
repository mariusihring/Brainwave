use std::sync::Arc;
use sqlx::{Pool, Sqlite};

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Pool<Sqlite>>,
}