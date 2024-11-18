use crate::graphql::{Mutation, Query};
use async_graphql::{EmptySubscription, Schema};

use sea_orm::DatabaseConnection;
use types::user::DatabaseUser;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub schema: Schema<Query, Mutation, EmptySubscription>,
}

#[derive(Clone)]
pub struct GraphqlContext {
    pub user: DatabaseUser,
}
