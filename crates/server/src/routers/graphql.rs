use crate::graphql::{Mutation, Query};
use crate::state::AppState;
use async_graphql::http::GraphiQLSource;
use async_graphql::{EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::body::Body;
use axum::extract::FromRequest;
use axum::{
    extract::{State, Extension},
    response::{Html, IntoResponse},
};
use http::Request;

use super::auth::DatabaseUser;

pub async fn graphiql(State(_state): State<AppState>) -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/").finish())
}
pub async fn graphql_handler(
    State(state): State<AppState>,
    Extension(user): Extension<DatabaseUser>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut req = req.into_inner();
    req = req.data(user);
    state.schema.execute(req).await.into()
}
