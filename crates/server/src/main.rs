use server::run_server;
mod auth;
pub mod graphql;
mod routers;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = run_server().await;

    Ok(())
}
