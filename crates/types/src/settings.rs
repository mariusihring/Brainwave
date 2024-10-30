use async_graphql::SimpleObject;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize,  SimpleObject)]
pub struct Settings {
    pub id: String,
    pub user_id: String,
    pub calendar_link: Option<String>,
}
