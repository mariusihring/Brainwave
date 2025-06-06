use crate::{models::_entities::user, state::AppState};
use async_graphql::http::GraphiQLSource;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    extract::{Extension, State},
    response::{Html, IntoResponse},
};

pub async fn graphiql(State(_state): State<AppState>) -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/").finish())
}
pub async fn graphql_handler(
    State(state): State<AppState>,
    Extension(user): Extension<user::Model>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let mut req = req.into_inner();
    req = req.data(user);
    state.schema.execute(req).await.into()
}
