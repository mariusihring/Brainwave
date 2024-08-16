use crate::{
    graphql::{Mutation, Query},
    state::AppState,
};
use async_graphql::{http::GraphiQLSource, EmptyMutation, EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    extract::State,
    http::HeaderMap,
    response::{Html, IntoResponse},
};

pub async fn graphiql(State(_state): State<AppState>) -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/").finish())
}
//TODO: create auth middlware to extract user from request
pub async fn graphql_handler(
    State(state): State<AppState>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut req = req.into_inner();

    state.schema.execute(req).await.into()
}
