use axum::{extract::State, middleware};
use std::{
    fs::{self, File},
    io::Write,
    sync::Arc,
};
pub mod state;
use async_graphql::{EmptySubscription, Schema};
use auth::validate_session;
use axum::{
    http::Method,
    routing::{get, post},
    Router,
};
pub mod auth;
mod dir;
mod graphql;
mod routers;
use crate::dir::database_path;
use graphql::{Mutation, Query};
use routers::{
    auth::{
        create_user, delete_expired_sessions, delete_session, delete_user_sessions,
        get_session_and_user, get_user, get_user_sessions, set_session, update_session_expiration,
    },
    graphql::{graphiql, graphql_handler},
};
use state::AppState;
use tokio::signal;
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};

pub async fn run_server() {
    std::env::set_var("RUST_LOG", "async-graphql=info");
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let db = database::init(&database_path().await.unwrap())
        .await
        .expect("failed to connect to db");

    let schema = Schema::build(Query::default(), Mutation::default(), EmptySubscription)
        .extension(async_graphql::extensions::Logger)
        .data(db.clone())
        .finish();

    let mut file = File::create("schema.graphqls").expect("failed to create schema file");
    file.write_all(schema.sdl().as_bytes())
        .expect("failed to write schema");

    let state = AppState { db, schema };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);

    //TODO: create auth middlware to protect endpoints
    let auth_router = Router::new()
        .route("/delete_session/:id", post(delete_session))
        .route("/delete_user_session/:id", post(delete_user_sessions))
        .route("/get_user_and_session/:id", post(get_session_and_user))
        .route("/get_user_sessions/:id", post(get_user_sessions))
        .route("/set_session", post(set_session))
        .route("/update_session", post(update_session_expiration))
        .route("/delete_sessions", post(delete_expired_sessions))
        .route("/get_user", post(get_user))
        .route("/create_user", post(create_user));

    let app = Router::new()
        .nest("/auth", auth_router)
        .route("/", get(graphiql))
        .route(
            "/",
            post(graphql_handler).route_layer(middleware::from_fn_with_state(
                state.clone(),
                validate_session,
            )),
        )
        .with_state(state.clone())
        .layer(ServiceBuilder::new().layer(cors));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown(state))
        .await
        .unwrap();
}

async fn shutdown(state: AppState) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    println!("Gracefully closing db pool");
    state.db.close().await;
}

#[cfg(test)]
mod tests {

    #[test]
    fn it_works() {}
}
