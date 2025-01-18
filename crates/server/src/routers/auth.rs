use crate::models::_entities::session;
use crate::models::_entities::user;
use anyhow::Result;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::NaiveDateTime;
use chrono::{DateTime, Utc};
use sea_orm::DatabaseConnection;
use sea_orm::DbErr;
use sea_orm::ModelTrait;
use sea_orm::QuerySelect;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use uuid::Uuid;
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseUser {
    pub id: String,
    pub attributes: HashMap<String, String>,
}

use crate::state::AppState;
//TODO: make the return of UUID be a actuall UUID and not a string

// Define constants for table names if necessary (SeaORM typically handles this via entities)
const SESSION_TABLE_NAME: &str = "session";
const USER_TABLE_NAME: &str = "user";

#[derive(Debug, Serialize, Deserialize)]
pub struct GetUserBody {
    pub username: String,
}

pub async fn get_user(
    State(state): State<AppState>,
    Json(payload): Json<GetUserBody>,
) -> Result<(StatusCode, Json<Option<DatabaseUser>>), (StatusCode, String)> {
    let db_user = user::Entity::find()
        .filter(user::Column::Username.eq(payload.username))
        .one(&state.db)
        .await
        .map_err(|e| (StatusCode::NOT_FOUND, format!("Database error: {}", e)))?
        .map(transform_into_database_user);

    Ok((StatusCode::OK, Json(db_user)))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserBody {
    pub id: String,
    pub username: String,
    pub hash: String,
}

pub async fn create_user(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserBody>,
) -> Result<(StatusCode, Json<Option<DatabaseUser>>), (StatusCode, String)> {
    let new_user = user::ActiveModel {
        id: Set(Uuid::parse_str(&payload.id).unwrap()),
        username: Set(payload.username.clone()),
        password_hash: Set(payload.hash.clone()),
        first_name: Set(String::from("test")),
        last_name: Set(String::from("test")), // Set other fields as necessary
        ..Default::default()
    };

    // Insert the new user into the database
    user::Entity::insert(new_user)
        .exec(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::BAD_REQUEST,
                format!("Failed to insert user: {}", e),
            )
        })?;

    // Fetch the inserted user
    let db_user = user::Entity::find()
        .filter(user::Column::Username.eq(payload.username))
        .one(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch user: {}", e),
            )
        })?
        .map(transform_into_database_user);

    Ok((StatusCode::OK, Json(db_user)))
}

pub async fn delete_session(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<StatusCode, (StatusCode, String)> {
    let delete_result =
        session::Entity::delete_by_id(Uuid::parse_str(id.clone().as_str()).unwrap())
            .exec(&state.db)
            .await
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Failed to delete session: {}", e),
                )
            })?;

    if delete_result.rows_affected > 0 {
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err((StatusCode::NOT_FOUND, "Session not found".into()))
    }
}

pub async fn delete_user_sessions(
    Path(user_id): Path<String>,
    State(state): State<AppState>,
) -> Result<StatusCode, (StatusCode, String)> {
    let _ = session::Entity::delete_many()
        .filter(session::Column::UserId.eq(user_id.clone()))
        .exec(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to delete user sessions: {}", e),
            )
        })?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn get_session_and_user(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<
    (
        StatusCode,
        Json<(Option<DatabaseSession>, Option<DatabaseUser>)>,
    ),
    (StatusCode, String),
> {
    // Fetch the session
    let session_model = session::Entity::find_by_id(Uuid::parse_str(id.clone().as_str()).unwrap())
        .one(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch session: {}", e),
            )
        })?;

    let session = session_model
        .map(transform_into_database_session)
        .unwrap()
        .unwrap();
    let session = Some(session);

    // Fetch the associated user if session exists
    let user = if let Some(ref sess) = session {
        user::Entity::find_by_id(Uuid::parse_str(sess.user_id.clone().as_str()).unwrap())
            .one(&state.db)
            .await
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Failed to fetch user: {}", e),
                )
            })?
            .map(transform_into_database_user)
    } else {
        None
    };

    Ok((StatusCode::OK, Json((session, user))))
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

pub async fn get_user_sessions(
    Path(user_id): Path<String>,
    State(state): State<AppState>,
) -> Result<(StatusCode, Json<Vec<DatabaseSession>>), (StatusCode, String)> {
    let sessions = session::Entity::find()
        .filter(session::Column::UserId.eq(user_id))
        .all(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch sessions: {}", e),
            )
        })?
        .into_iter()
        .map(transform_into_database_session)
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::OK, Json(sessions)))
}

#[derive(Debug, Serialize)]
pub struct LuciaSession {
    pub id: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: DateTime<Utc>,
    pub fresh: bool,
    #[serde(rename = "userId")]
    pub user_id: String,
}

pub async fn set_session(
    State(state): State<AppState>,
    Json(session): Json<DatabaseSession>,
) -> Result<(StatusCode, Json<LuciaSession>), (StatusCode, String)> {
    let expires_at_naive: NaiveDateTime = session.expires_at.naive_utc();
    println!("{:#?}", session);
    let new_session = session::ActiveModel {
        id: Set(Uuid::parse_str(session.id.clone().as_str()).unwrap()),
        user_id: Set(Uuid::parse_str(session.user_id.clone().as_str()).unwrap()),
        expires_at: Set(expires_at_naive),
        // Assuming attributes are stored as JSON or similar; adjust as needed
    };

    session::Entity::insert(new_session)
        .exec(&state.db)
        .await
        .map_err(|e| {
            println!("{:#?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to set session: {}", e),
            )
        })?;

    // Return the session in Lucia's expected format
    let lucia_session = LuciaSession {
        id: session.id,
        expires_at: session.expires_at,
        fresh: true,
        user_id: session.user_id,
    };

    Ok((StatusCode::CREATED, Json(lucia_session)))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateExpiration {
    session_id: String,
    expires_at: DateTime<Utc>,
}

pub async fn update_session_expiration(
    State(state): State<AppState>,
    Json(body): Json<UpdateExpiration>,
) -> Result<StatusCode, (StatusCode, String)> {
    let session_model =
        session::Entity::find_by_id(Uuid::parse_str(body.session_id.clone().as_str()).unwrap())
            .one(&state.db)
            .await
            .map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Failed to fetch session: {}", e),
                )
            })?
            .ok_or((StatusCode::NOT_FOUND, "Session not found".into()))?;

    let mut active_model: session::ActiveModel = session_model.into();
    let expires_at_naive: NaiveDateTime = body.expires_at.naive_utc();

    active_model.expires_at = Set(expires_at_naive);

    active_model.update(&state.db).await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to update session: {}", e),
        )
    })?;

    Ok(StatusCode::OK)
}

pub async fn delete_expired_sessions(
    State(state): State<AppState>,
) -> Result<StatusCode, (StatusCode, String)> {
    let current_timestamp = Utc::now().timestamp();

    let _ = session::Entity::delete_many()
        .filter(session::Column::ExpiresAt.lte(current_timestamp))
        .exec(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to delete expired sessions: {}", e),
            )
        })?;

    Ok(StatusCode::NO_CONTENT)
}

// Transformation functions

fn transform_into_database_session(model: session::Model) -> Result<DatabaseSession> {
    let expires_at_naive = model.expires_at.and_utc();

    Ok(DatabaseSession {
        id: model.id.clone().to_string(),
        user_id: model.user_id.clone().to_string(),
        expires_at: expires_at_naive,
        attributes: HashMap::new(), // Populate if attributes are stored
    })
}

fn transform_into_database_user(model: user::Model) -> DatabaseUser {
    let mut attributes = HashMap::new();
    attributes.insert("username".to_string(), model.username.clone());
    attributes.insert("password_hash".to_string(), model.password_hash.clone());
    // Add other attributes as needed

    DatabaseUser {
        id: model.id.clone().to_string(),
        attributes,
    }
}

pub async fn get_user_from_session_id(
    session_id: &str,
    db: &DatabaseConnection,
) -> Result<Option<user::Model>, DbErr> {
    let session = session::Entity::find_by_id(Uuid::parse_str(session_id).unwrap())
        .one(db)
        .await?;

    match session {
        None => Ok(None),
        Some(sess) => sess.find_related(user::Entity).one(db).await,
    }
}
