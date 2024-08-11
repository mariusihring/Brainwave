use std::{fs::File, sync::Arc};
pub mod state;
use axum::{
    http::Method,
    routing::{get, post},
    Router,
};
mod routers;
use routers::auth::{
    create_user, delete_expired_sessions, delete_session, delete_user_sessions,
    get_session_and_user, get_user, get_user_sessions, set_session, update_session_expiration,
};
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};

use state::AppState;

//TODO: make database shut down gracefully when we stop the server. Maybe do this with an endpoint or smth
pub async fn run_server() {
    tracing_subscriber::fmt::init();
    File::create("auth.db");

    let db = database::init("auth.db")
        .await
        .expect("failed to connect to db");
    let state = AppState { db: Arc::new(db) };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);

    let auth_router = Router::new()
        .route("/delete_session/:id", post(delete_session))
        .route("/delete_user_session/:id", post(delete_user_sessions))
        .route("/get_user_and_session/:id", post(get_session_and_user))
        .route("/get_user_sessions/:id", post(get_user_sessions))
        .route("/set_session", post(set_session))
        .route("/update_session", post(update_session_expiration))
        .route("/delete_sessions", post(delete_expired_sessions))
        .route("/get_user", get(get_user))
        .route("/create_user", post(create_user));

    let app = Router::new()
        .route("/", get(root))
        .nest("/auth", auth_router)
        .with_state(state)
        .layer(ServiceBuilder::new().layer(cors));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {}
}
