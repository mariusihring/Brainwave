use std::fs::File;
use std::io::Write;

use async_graphql::{EmptySubscription, Schema};
use axum::{
    http::Method,
    middleware,
    routing::{get, post},
    Router,
};
use log::LevelFilter;
use tokio::signal;
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};

mod auth;
mod dir;
mod graphql;
mod routers;
mod state;

use crate::{
    auth::validate_session,
    dir::database_path,
    graphql::{Mutation, Query},
    routers::{
        auth::{
            create_user, delete_expired_sessions, delete_session, delete_user_sessions,
            get_session_and_user, get_user, get_user_sessions, set_session,
            update_session_expiration,
        },
        graphql::{graphiql, graphql_handler},
    },
    state::AppState,
};

pub async fn run_server() {
    setup_logging();
    let state = setup_app_state().await;
    let app = build_router(state.clone());

    start_server(app, state).await;
}

fn setup_logging() {
    unsafe { std::env::remove_var("RUST_LOG") };
    env_logger::Builder::new()
        .filter_level(LevelFilter::Info)
        .filter_module("scraper", LevelFilter::Off)
        .filter_module("async_graphql", LevelFilter::Info)
        .parse_default_env()
        .init();
}

async fn setup_app_state() -> AppState {
    let db = database::init(&database_path().await.unwrap())
        .await
        .expect("failed to connect to db");

    let schema = Schema::build(Query::default(), Mutation::default(), EmptySubscription)
        .extension(async_graphql::extensions::Logger)
        .data(db.clone())
        .finish();

     write_schema_to_file(&schema);

    AppState { db, schema }
}

fn write_schema_to_file(schema: &Schema<Query, Mutation, EmptySubscription>) {
    let mut file = File::create("schema.graphqls").expect("failed to create schema file");
    file.write_all(schema.sdl().as_bytes())
        .expect("failed to write schema");
}

fn build_router(state: AppState) -> Router {
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
        .route("/get_user", post(get_user))
        .route("/create_user", post(create_user));

    Router::new()
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
        .layer(ServiceBuilder::new().layer(cors))
}

async fn start_server(app: Router, state: AppState) {
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
    use database::init;

    #[tokio::test]
    async fn it_works() {
        let db = init("./test.db").await.unwrap();
    }
}
