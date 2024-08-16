use axum::extract::State;
use axum::response::Response;
use axum::{extract::Request, middleware::Next};

use crate::state::AppState;

pub async fn validate_jwt(
    mut req: Request,
    State(state): State<AppState>,
    next: Next,
) -> Result<Response, String> {
    let session_token = req
        .headers()
        .get(http::header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok());

    let session_token = match session_token {
        Some(jwt_token) => jwt_token.replace("Bearer ", ""),
        None => return Err(String::from("Authorization Token is missing")),
    };

    Ok(next.run(req).await)
}

