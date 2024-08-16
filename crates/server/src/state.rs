use async_graphql::{EmptySubscription, Schema};
use sqlx::{Pool, Sqlite};

use crate::{
    graphql::{Mutation, Query},
    routers::auth::DatabaseUser,
};

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Sqlite>,
    pub schema: Schema<Query, Mutation, EmptySubscription>,

}

#[derive(Clone)]
pub struct GraphqlContext {
    pub user: DatabaseUser,
}
