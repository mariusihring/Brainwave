use axum::extract::State;
use axum::response::Response;
use axum::{extract::Request, middleware::Next};
use http::StatusCode;
use sqlx::Acquire;

use crate::routers::auth::get_user_from_session_id;
use crate::state::AppState;

pub async fn validate_session(
    State(state): State<AppState>,
    mut req: Request,
    next: Next,
) -> Result<Response, (StatusCode, String)> {
    let session_token = req
        .headers()
        .get(http::header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok());

    let session_token = match session_token {
        Some(jwt_token) => jwt_token.replace("Bearer ", ""),
        None => {
            return Err((
                StatusCode::UNAUTHORIZED,
                String::from("Authorization Token is missing"),
            ))
        }
    };
    let mut conn = state.db.clone().acquire().await.unwrap();

    let user = match get_user_from_session_id(session_token.as_str(), &mut *conn).await {
        Ok(user_option) => user_option,
        Err(e) => return Err((StatusCode::UNAUTHORIZED, e.to_string())),
    };

    match user {
        Some(user) => {
            req.extensions_mut().insert(user);
            Ok(next.run(req).await)
        }
        None => {
            return Err((
                StatusCode::UNAUTHORIZED,
                String::from("User could not be found"),
            ))
        }
    }
}
