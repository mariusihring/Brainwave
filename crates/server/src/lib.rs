use axum::middleware;
use std::{fs::File, io::Write, sync::Arc};
pub mod state;
use async_graphql::{EmptySubscription, Schema};
use auth::validate_session;
use axum::{
    http::Method,
    routing::{get, post},
    Router,
};
mod auth;
mod graphql;
mod routers;
use graphql::{Mutation, Query};
use routers::{
    auth::{
        create_user, delete_expired_sessions, delete_session, delete_user_sessions,
        get_session_and_user, get_user, get_user_sessions, set_session, update_session_expiration,
    },
    graphql::{graphiql, graphql_handler},
};
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};

use state::AppState;

//TODO: make database shut down gracefully when we stop the server. Maybe do this with an endpoint or smth
//
pub async fn run_server() {
    std::env::set_var("RUST_LOG", "async-graphql=info");
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    File::create("auth.db").expect("Failed to create database file");
    let db = database::init("auth.db")
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
        .with_state(state)
        .layer(ServiceBuilder::new().layer(cors));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {

    #[test]
    fn it_works() {}
}
