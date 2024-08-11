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
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");
    let row = sqlx::query(&format!(
        "SELECT * FROM {} WHERE username = ?",
        USER_TABLE_NAME
    ))
    .bind(user.username)
    .fetch_optional(&mut *db)
    .await
    .expect("Failed to get user");

    let temp = row
        .map(|r| transform_into_database_user(&r))
        .transpose()
        .unwrap();

    (StatusCode::OK, Json(temp))
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
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");

    let row = sqlx::query(&format!(
        "INSERT INTO {} (id, username, password_hash) VALUES(?, ?, ?)",
        USER_TABLE_NAME
    ))
    .bind(user.id)
    .bind(user.username.clone())
    .bind(user.hash)
    .execute(&mut *db)
    .await;


    let row = sqlx::query(&format!(
        "SELECT * FROM {} WHERE username = ?",
        USER_TABLE_NAME
    ))
    .bind(user.username)
    .fetch_optional(&mut *db)
    .await
    .expect("Failed to get user");

    let temp = row
        .map(|r| transform_into_database_user(&r))
        .transpose()
        .unwrap();

    (StatusCode::OK, Json(temp))
}

pub async fn delete_session(Path(id): Path<String>, State(state): State<AppState>) {
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");

    sqlx::query(&format!("DELETE FROM {} WHERE id = ?", SESSION_TABLE_NAME))
        .bind(id)
        .execute(&mut *db)
        .await
        .expect("failed to delete seesion");
}

pub async fn delete_user_sessions(Path(id): Path<String>, State(state): State<AppState>) {
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");
    sqlx::query(&format!(
        "DELETE FROM {} WHERE user_id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(id)
    .execute(&mut *db)
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
    let mut db1 = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");

    let mut db2 = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");

    let (session, user) = tokio::join!(
        get_session(id.as_str(), &mut db1),
        get_user_from_session_id(id.as_str(), &mut db2)
    );
    let session = session.expect("failed to get session");
    let user = user.expect("failed to get session");
    (StatusCode::OK, Json((session, user)))
}

pub async fn get_user_sessions(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> (StatusCode, Json<Vec<DatabaseSession>>) {
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");
    let rows = sqlx::query(&format!(
        "SELECT * FROM {} WHERE user_id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(id)
    .fetch_all(&mut *db)
    .await
    .expect("failed to get data");

    let sessions = rows
        .into_iter()
        .map(|row| transform_into_database_session(&row).unwrap())
        .collect();

    (StatusCode::OK, Json(sessions))
}

pub async fn set_session(State(state): State<AppState>, Json(session): Json<DatabaseSession>) -> StatusCode{
    let expires_at = session.expires_at.timestamp();
   
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");
    sqlx::query(&format!(
        "INSERT INTO {} (id, user_id, expires_at) VALUES (?, ?, ?)",
        SESSION_TABLE_NAME
    ))
    .bind(&session.id)
    .bind(&session.user_id)
    .bind(expires_at)
    .execute(&mut *db)
    .await
    .expect("failed to set session");
    StatusCode::OK
}

pub async fn update_session_expiration(
    State(state): State<AppState>,
    Json(body): Json<UpdateExpiration>,
) {
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");
    sqlx::query(&format!(
        "UPDATE {} SET expires_at = ? WHERE id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(body.expires_at.timestamp())
    .bind(body.session_id)
    .execute(&mut *db)
    .await
    .expect("failed to update session");
}

pub async fn delete_expired_sessions(State(state): State<AppState>) {
    let mut db = state
        .db
        .acquire()
        .await
        .expect("failed to get db from state");
    sqlx::query(&format!(
        "DELETE FROM {} WHERE expires_at <= ?",
        SESSION_TABLE_NAME
    ))
    .bind(Utc::now().timestamp())
    .execute(&mut *db)
    .await
    .expect("failed to delete session");
}

async fn get_session(
    session_id: &str,
    pool: &mut PoolConnection<Sqlite>,
) -> Result<Option<DatabaseSession>> {
    let row = sqlx::query(&format!(
        "SELECT * FROM {} WHERE id = ?",
        SESSION_TABLE_NAME
    ))
    .bind(session_id)
    .fetch_optional(&mut *pool)
    .await?;

    row.map(|r| transform_into_database_session(&r)).transpose()
}

async fn get_user_from_session_id(
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
    pub user_id: String,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
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
