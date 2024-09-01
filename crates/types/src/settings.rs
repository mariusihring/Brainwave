use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, SimpleObject)]
pub struct Settings {
    pub id: String,
    pub user_id: String,
    pub calendar_link: Option<String>,
}
