use anyhow::{anyhow, Result};
use chrono::{DateTime, Utc};
use serde_json::Value;
use sqlx::{ Pool, Row, Sqlite};
use std::collections::HashMap;

pub struct SQLiteAdapter {
    escaped_user_table_name: String,
    escaped_session_table_name: String,
}

impl SQLiteAdapter {
    pub async fn delete_session(&self, session_id: &str, pool: &mut Pool<Sqlite>) -> Result<()> {
        sqlx::query(&format!(
            "DELETE FROM {} WHERE id = ?",
            self.escaped_session_table_name
        ))
        .bind(session_id)
        .execute( &*pool)
        .await?;
        Ok(())
    }

    pub async fn delete_user_sessions(&self, user_id: &str, pool: &mut Pool<Sqlite>) -> Result<()> {
        sqlx::query(&format!(
            "DELETE FROM {} WHERE user_id = ?",
            self.escaped_session_table_name
        ))
        .bind(user_id)
        .execute(&*pool)
        .await?;
        Ok(())
    }

    pub async fn get_session_and_user(
        &self,
        session_id: &str,
        pool: &mut Pool<Sqlite>,
    ) -> Result<(Option<DatabaseSession>, Option<DatabaseUser>)> {
        let mut cloned_pool = pool.clone();
        let (session, user) = tokio::join!(
            self.get_session(session_id, pool),
            self.get_user_from_session_id(session_id, &mut cloned_pool)
        );
        Ok((session?, user?))
    }

    pub async fn get_user_sessions(
        &self,
        user_id: &str,
        pool: &mut Pool<Sqlite>,
    ) -> Result<Vec<DatabaseSession>> {
        let rows = sqlx::query(&format!(
            "SELECT * FROM {} WHERE user_id = ?",
            self.escaped_session_table_name
        ))
        .bind(user_id)
        .fetch_all(&*pool)
        .await?;

        rows.into_iter()
            .map(|row| transform_into_database_session(&row))
            .collect()
    }

    pub async fn set_session(
        &self,
        session: &DatabaseSession,
        pool: &mut Pool<Sqlite>,
    ) -> Result<()> {
        let expires_at = session.expires_at.timestamp();
        let attributes_json = serde_json::to_value(&session.attributes)?;

        sqlx::query(&format!(
            "INSERT INTO {} (id, user_id, expires_at, attributes) VALUES (?, ?, ?, ?)",
            self.escaped_session_table_name
        ))
        .bind(&session.id)
        .bind(&session.user_id)
        .bind(expires_at)
        .bind(attributes_json.to_string())
        .execute(&*pool)
        .await?;

        Ok(())
    }

    pub async fn update_session_expiration(
        &self,
        session_id: &str,
        expires_at: DateTime<Utc>,
        pool: &mut Pool<Sqlite>,
    ) -> Result<()> {
        sqlx::query(&format!(
            "UPDATE {} SET expires_at = ? WHERE id = ?",
            self.escaped_session_table_name
        ))
        .bind(expires_at.timestamp())
        .bind(session_id)
        .execute(&*pool)
        .await?;

        Ok(())
    }

    pub async fn delete_expired_sessions(&self, pool: &mut Pool<Sqlite>) -> Result<()> {
        sqlx::query(&format!(
            "DELETE FROM {} WHERE expires_at <= ?",
            self.escaped_session_table_name
        ))
        .bind(Utc::now().timestamp())
        .execute(&*pool)
        .await?;

        Ok(())
    }

    async fn get_session(
        &self,
        session_id: &str,
        pool: &mut Pool<Sqlite>,
    ) -> Result<Option<DatabaseSession>> {
        let row = sqlx::query(&format!(
            "SELECT * FROM {} WHERE id = ?",
            self.escaped_session_table_name
        ))
        .bind(session_id)
        .fetch_optional(&*pool)
        .await?;

        row.map(|r| transform_into_database_session(&r)).transpose()
    }

    async fn get_user_from_session_id(
        &self,
        session_id: &str,
        pool: &mut Pool<Sqlite>,
    ) -> Result<Option<DatabaseUser>> {
        let row = sqlx::query(&format!(
            "SELECT {}.* FROM {} INNER JOIN {} ON {}.id = {}.user_id WHERE {}.id = ?",
            self.escaped_user_table_name,
            self.escaped_session_table_name,
            self.escaped_user_table_name,
            self.escaped_user_table_name,
            self.escaped_session_table_name,
            self.escaped_session_table_name
        ))
        .bind(session_id)
        .fetch_optional(&*pool)
        .await?;

        row.map(|r| transform_into_database_user(&r)).transpose()
    }
}

fn transform_into_database_session(row: &sqlx::sqlite::SqliteRow) -> Result<DatabaseSession> {
    let id: String = row.try_get("id")?;
    let user_id: String = row.try_get("user_id")?;
    let expires_at: i64 = row.try_get("expires_at")?;
    let attributes_json: String = row.try_get("attributes")?;

    let attributes: HashMap<String, Value> = serde_json::from_str(&attributes_json)?;

    Ok(DatabaseSession {
        id,
        user_id,
        expires_at: DateTime::from_timestamp(expires_at, 0)
            .ok_or_else(|| anyhow!("Invalid timestamp"))?,
        attributes,
    })
}

fn transform_into_database_user(row: &sqlx::sqlite::SqliteRow) -> Result<DatabaseUser> {
    let id: String = row.try_get("id")?;
    let attributes_json: String = row.try_get("attributes")?;

    let attributes: HashMap<String, Value> = serde_json::from_str(&attributes_json)?;

    Ok(DatabaseUser { id, attributes })
}

fn escape_name(name: &str) -> String {
    format!("`{}`", name)
}

pub struct TableNames {
    user: String,
    session: String,
}

#[derive(Debug)]
pub struct DatabaseSession {
    pub id: String,
    pub user_id: String,
    pub expires_at: DateTime<Utc>,
    pub attributes: HashMap<String, Value>,
}

#[derive(Debug)]
pub struct DatabaseUser {
    pub id: String,
    pub attributes: HashMap<String, Value>,
}
