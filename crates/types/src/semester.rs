use crate::course::Course;
use crate::module::Module;
use crate::user::DatabaseUser;
use async_graphql::{ComplexObject, Context, InputObject, SimpleObject};
use chrono::NaiveDate;

#[derive(SimpleObject, Debug)]
// #[graphql(complex)]
pub struct Semester {
    pub id: String,
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
    pub imported_appointments: bool,
}

#[derive(InputObject)]
pub struct NewSemester {
    pub semester: i32,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub total_ects: i32,
}

// #[ComplexObject]
// impl Semester {
//     async fn modules(&self, ctx: &Context<'_>) -> Vec<Module> {
//         let user = ctx.data::<DatabaseUser>().expect("failed to get db conn");
//         // let db = ctx.data::<Pool<Sqlite>>().expect("failed to get user");
//         let mut response: Vec<Module> = Vec::new();
//         // let modules: Vec<Module> = sqlx::query_as(
//             "SELECT * FROM modules WHERE user_id = ? and start_semester = ? or end_semester = ?;",
//         // )
//         // .bind(user.id.clone())
//         // .bind(self.id.clone())
//         // .bind(self.id.clone())
//         // .fetch_all(db)
//         // .await
//         // .map_err(|err| async_graphql::Error::from(err))
//         // .expect("failed to get modules");
//         // for module in modules {
//             // response.push(module)
//         // }
//         response
//     }

//     async fn courses(&self, ctx: &Context<'_>) -> Vec<Course> {
//         let user = ctx.data::<DatabaseUser>().expect("failed to get db conn");
//         // let db = ctx.data::<Pool<Sqlite>>().expect("failed to get user");
//         // let modules = self.modules(ctx).await.unwrap();
//         // if (modules.len() == 0) {
//         //     return vec![];
//         // }
//         // let mut module_ids: String = String::from(format!("{}", modules[0].id));
//         // for n in 1..modules.len() {
//         //     module_ids.push_str(format!(" OR {}", modules[n].id).as_str());
//         // }
//         let mut response: Vec<Course> = Vec::new();
//         let courses: Vec<Course> =
//             sqlx::query_as("SELECT * FROM courses WHERE user_id = ? and module_id = ?;")
//                 .bind(user.id.clone())
//                 .bind(module_ids)
//                 .fetch_all(db)
//                 .await
//                 .map_err(|err| async_graphql::Error::from(err))
//                 .expect("failed to get modules");
//         for course in courses {
//             response.push(course)
//         }
//         response
//     }
// }
