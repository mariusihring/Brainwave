
use axum::{response::{IntoResponse, Html}, extract::{State}, http::HeaderMap};
use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema, EmptyMutation};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use crate::{graphql::{Query, Mutation}, state::AppState};


pub async fn graphiql(
    State(_state): State<AppState> ) -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/").finish())
}

pub async fn graphql_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut req = req.into_inner();
   
    state.schema.execute(req).await.into()
}
