use async_graphql::Error as GraphQLError;
use std::fmt;

/// Custom Error type for the application.
#[derive(Debug)]
pub struct Error {
    message: String,
}

impl Error {
    /// Creates a new Error from a message.
    pub fn new<T: ToString>(msg: T) -> Self {
        Self {
            message: msg.to_string(),
        }
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl From<sea_orm::DbErr> for Error {
    fn from(err: sea_orm::DbErr) -> Self {
        Self::new(err.to_string())
    }
}

impl From<reqwest::Error> for Error {
    fn from(err: reqwest::Error) -> Self {
        Self::new(err.to_string())
    }
}

impl From<chrono::ParseError> for Error {
    fn from(err: chrono::ParseError) -> Self {
        Self::new(err.to_string())
    }
}

impl From<url::ParseError> for Error {
    fn from(err: url::ParseError) -> Self {
        Self::new(err.to_string())
    }
}

impl From<async_graphql::Error> for Error {
    fn from(err: async_graphql::Error) -> Self {
        Self::new(err.to_string())
    }
}
