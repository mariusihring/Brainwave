use anyhow::{anyhow, Result};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::{pool::PoolConnection, Row, Sqlite, SqliteConnection};
use std::collections::HashMap;

use crate::state::AppState;

const SESSION_TABLE_NAME: &'static str = "`session`";
const USER_TABLE_NAME: &'static str = "`user`";
#[derive(Debug, Serialize, Deserialize)]
pub struct GetUserBody {
    pub username: String,
}
pub async fn get_user(
    State(state): State<AppState>,
    Json(user): Json<GetUserBody>,
) -> (StatusCode, Json<Option<DatabaseUser>>) {
    let db_user = sqlx::query(&format!(
        "SELECT * FROM {} WHERE username = ?",
        USER_TABLE_NAME
    ))
    .bind(user.username)
    .fetch_optional(&state.db)
    .await
    .expect("Failed to get user")
    .map(|r| transform_into_database_user(&r))
    .transpose()
    .unwrap();

    (StatusCode::OK, Json(db_user))
}
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserBody {
    pub id: String,
    pub username: String,
    pub hash: String,
}
pub async fn create_user(
    State(state): State<AppState>,
    Json(user): Json<CreateUserBody>,
) -> (StatusCode, Json<Option<DatabaseUser>>) {
    let row = sqlx::query(&format!(
        "INSERT INTO {} (id, username, password_hash) VALUES(?, ?, ?)",
        USER_TABLE_NAME
    ))
    .bind(user.id)
    .bind(user.username.clone())
    .bind(user.hash)
    .execute(&state.db.clone())
    .await;

    let user = sqlx::query(&format!(
        "SELECT * FROM {} WHERE username = ?",
        USER_TABLE_NAME
    ))
    .bind(user.username)
    .fetch_optional(&state.db)
    .await
    .expect("Failed to get user")
    .map(|r| transform_into_database_user(&r))
    .transpose()
    .unwrap();

    (StatusCode::OK, Json(user))
}

pub async fn delete_session(Path(id): Path<String>, State(state): State<AppState>) {
    sqlx::query(&format!("DELETE FROM {} WHERE id = ?", SESSION_TABLE_NAME))
        .bind(id)
        .execute(&state.db)
        .await
        .expect("failed to delete seesion");
}

pub async fn delete_user_sessions(Path(id): Path<String>, State(state): State<AppState>) {
    sqlx::query(&format!(
        "DELETE FROM {} WHERE user_id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(id)
    .execute(&state.db)
    .await
    .expect("failed to remove user sessions");
}

pub async fn get_session_and_user(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> (
    StatusCode,
    Json<(Option<DatabaseSession>, Option<DatabaseUser>)>,
) {
    let session = sqlx::query(&format!(
        "SELECT * FROM {} WHERE id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(id.clone())
    .fetch_optional(&state.db.clone())
    .await
    .expect("Failed to get session")
    .map(|r| transform_into_database_session(&r))
    .transpose()
    .unwrap();

    let user = sqlx::query(&format!(
        "SELECT {}.* FROM {} INNER JOIN {} ON {}.id = {}.user_id WHERE {}.id = ?",
        USER_TABLE_NAME,
        SESSION_TABLE_NAME,
        USER_TABLE_NAME,
        USER_TABLE_NAME,
        SESSION_TABLE_NAME,
        SESSION_TABLE_NAME
    ))
    .bind(id)
    .fetch_optional(&state.db)
    .await
    .expect("Failed to get user")
    .map(|r| transform_into_database_user(&r))
    .transpose()
    .unwrap();

    (StatusCode::OK, Json((session, user)))
}

pub async fn get_user_sessions(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> (StatusCode, Json<Vec<DatabaseSession>>) {
    let sessions = sqlx::query(&format!(
        "SELECT * FROM {} WHERE user_id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(id)
    .fetch_all(&state.db)
    .await
    .expect("failed to get data")
    .into_iter()
    .map(|row| transform_into_database_session(&row).unwrap())
    .collect();

    (StatusCode::OK, Json(sessions))
}

pub async fn set_session(
    State(state): State<AppState>,
    Json(session): Json<DatabaseSession>,
) -> StatusCode {
    let expires_at = session.expires_at.timestamp();

    sqlx::query(&format!(
        "INSERT INTO {} (id, user_id, expires_at) VALUES (?, ?, ?)",
        SESSION_TABLE_NAME
    ))
    .bind(&session.id)
    .bind(&session.user_id)
    .bind(expires_at)
    .execute(&state.db)
    .await
    .expect("failed to set session");
    StatusCode::OK
}

pub async fn update_session_expiration(
    State(state): State<AppState>,
    Json(body): Json<UpdateExpiration>,
) {
    sqlx::query(&format!(
        "UPDATE {} SET expires_at = ? WHERE id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(body.expires_at.timestamp())
    .bind(body.session_id)
    .execute(&state.db)
    .await
    .expect("failed to update session");
}

pub async fn delete_expired_sessions(State(state): State<AppState>) {
    sqlx::query(&format!(
        "DELETE FROM {} WHERE expires_at <= ?",
        SESSION_TABLE_NAME
    ))
    .bind(Utc::now().timestamp())
    .execute(&state.db)
    .await
    .expect("failed to delete session");
}

async fn get_session(
    session_id: &str,
    pool: &mut PoolConnection<Sqlite>,
) -> Result<Option<DatabaseSession>> {
    sqlx::query(&format!(
        "SELECT * FROM {} WHERE id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(session_id)
    .fetch_optional(&mut *pool)
    .await
    .expect("failed to get session")
    .map(|r| transform_into_database_session(&r))
    .transpose()
}

pub async fn get_user_from_session_id(
    session_id: &str,
    pool: &mut SqliteConnection,
) -> Result<Option<DatabaseUser>> {
    let row = sqlx::query(&format!(
        "SELECT {}.* FROM {} INNER JOIN {} ON {}.id = {}.user_id WHERE {}.id = ?",
        USER_TABLE_NAME,
        SESSION_TABLE_NAME,
        USER_TABLE_NAME,
        USER_TABLE_NAME,
        SESSION_TABLE_NAME,
        SESSION_TABLE_NAME
    ))
    .bind(session_id)
    .fetch_optional(&mut *pool)
    .await?;

    row.map(|r| transform_into_database_user(&r)).transpose()
}
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateExpiration {
    session_id: String,
    expires_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseSession {
    pub id: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: DateTime<Utc>,
    #[serde(default)]
    pub attributes: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseUser {
    pub id: String,
    pub attributes: HashMap<String, String>,
}

fn transform_into_database_session(row: &sqlx::sqlite::SqliteRow) -> Result<DatabaseSession> {
    let id: String = row.try_get("id")?;
    let user_id: String = row.try_get("user_id")?;
    let expires_at: i64 = row.try_get("expires_at")?;

    Ok(DatabaseSession {
        id,
        user_id,
        expires_at: DateTime::from_timestamp(expires_at, 0)
            .ok_or_else(|| anyhow!("Invalid timestamp"))?,
        attributes: HashMap::new(),
    })
}

fn transform_into_database_user(row: &sqlx::sqlite::SqliteRow) -> Result<DatabaseUser> {
    let id: String = row.try_get("id")?;
    let username: String = row.try_get("username")?;
    let password_hash: String = row.try_get("password_hash")?;

    let mut attributes: HashMap<String, String> = HashMap::new();
    attributes.insert(String::from("username"), username);
    attributes.insert(String::from("password_hash"), password_hash);

    Ok(DatabaseUser { id, attributes })
}

fn escape_name(name: &str) -> String {
    format!("`{}`", name)
}
