use std::{fs::File, sync::Arc};
pub mod state;
use axum::{
    routing::{get, post},
    Router,
};
mod routers;
use routers::auth::{
    delete_expired_sessions, delete_session, delete_user_sessions, get_session_and_user,
    get_user_sessions, set_session, update_session_expiration,
};


use state::AppState;



//TODO: make database shut down gracefully when we stop the server. Maybe do this with an endpoint or smth
pub async fn run_server() {
    tracing_subscriber::fmt::init();
    File::create("auth.db");
    let db = database::init("auth.db").await.expect("failed to connect to db");
    let state = AppState { db: Arc::new(db) };

    let auth_router = Router::new()
        .route("/delete_session/:id", post(delete_session))
        .route("/delete_user_session/:id", post(delete_user_sessions))
        .route("/get_user_and_session/:id", post(get_session_and_user))
        .route("/get_user_sessions/:id", post(get_user_sessions))
        .route("/set_session", post(set_session))
        .route("/update_session", post(update_session_expiration))
        .route("/delete_session", post(delete_expired_sessions));

    let app = Router::new()
        .route("/", get(root))
        .nest("/auth", auth_router)
        .with_state(state);

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
