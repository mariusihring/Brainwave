use crate::module::Module;
use crate::user::DatabaseUser;
use async_graphql::{ComplexObject, Context, InputObject, SimpleObject};
use chrono::NaiveDate;
use sqlx::prelude::FromRow;
use sqlx::{Pool, Sqlite};
//TODO: https://async-graphql.github.io/async-graphql/en/define_simple_object.html#user-defined-resolvers

#[derive(SimpleObject, FromRow, Debug)]
#[graphql(complex)]
pub struct Semester {
    pub id: String,
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}

#[derive(InputObject)]
pub struct NewSemester {
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}

#[ComplexObject]
impl Semester {
    async fn modules(&self, ctx: &Context<'_>) -> Vec<Module> {
        let user = ctx.data::<DatabaseUser>().expect("failed to get db conn");
        let db = ctx.data::<Pool<Sqlite>>().expect("failed to get user");
        let mut response: Vec<Module> = Vec::new();
        let modules: Vec<Module> = sqlx::query_as("SELECT * FROM modules WHERE user_id = ?;")
            .bind(user.id.clone())
            .fetch_all(db)
            .await
            .map_err(|err| async_graphql::Error::from(err))
            .expect("failed to get modules");
        for module in modules {
            response.push(module)
        }
        response
    }
    //TODO: make return courses
    async fn courses(&self, ctx: &Context<'_>) -> Vec<String> {
        vec![]
    }
}
