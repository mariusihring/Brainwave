use async_graphql::*;

mod mutation;
mod query;

#[derive(Default)]
pub struct CalendarQuery;

#[derive(Default)]
pub struct CalendarMutation;
