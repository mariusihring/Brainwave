use async_graphql::{Schema, EmptySubscription};
use sqlx::{Pool, Sqlite};

use crate::graphql::{Mutation, Query};

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Sqlite>,
    pub schema: Schema<Query, Mutation, EmptySubscription>
}