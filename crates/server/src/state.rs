use crate::graphql::{Mutation, Query};
use crate::models::_entities::user;
use async_graphql::{EmptySubscription, Schema};
use sea_orm::DatabaseConnection;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub schema: Schema<Query, Mutation, EmptySubscription>,
}

#[derive(Clone)]
pub struct GraphqlContext {
    pub user: user::Model,
}
