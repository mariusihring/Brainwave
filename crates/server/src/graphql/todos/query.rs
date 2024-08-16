use crate::routers::auth::DatabaseUser;

use super::TodoQuery;
use ::types::todo::Todo;
use async_graphql::{Context, Object};
use chrono::{NaiveDate, NaiveDateTime};

#[Object]
impl TodoQuery {
    async fn todo(&self, ctx: &Context<'_>, id: String) -> Todo {
        let user = ctx.data::<DatabaseUser>().unwrap();
        Todo {
            id,
            title: "First todo".into(),
            due_on: NaiveDateTime::parse_from_str("2015-09-05 23:56:04", "%Y-%m-%d %H:%M:%S")
                .unwrap(),
            icon: "Test".into(),
            user_id: user.id.clone(),
        }
    }

    async fn todos(&self) -> Vec<Todo> {
        vec![
            Todo {
                id: "1".into(),
                title: "First todo".into(),
                due_on: NaiveDateTime::parse_from_str("2015-09-05 23:56:04", "%Y-%m-%d %H:%M:%S")
                    .unwrap(),
                icon: "Test".into(),
                user_id: "123".into(),
            },
            Todo {
                id: "2".into(),
                title: "Second todo".into(),
                due_on: NaiveDateTime::parse_from_str("2015-09-05 23:56:04", "%Y-%m-%d %H:%M:%S")
                    .unwrap(),
                icon: "Test".into(),
                user_id: "123".into(),
            },
        ]
    }

    async fn todos_by_date(&self, date: NaiveDate) -> Vec<Todo> {
        vec![]
    }
}
