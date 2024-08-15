mod assignments;
mod courses;
mod exams;
mod flashcards;
mod notes;
mod todos;

use async_graphql::*;

#[derive(MergedObject, Default)]
pub struct Query(PlaceHolderQuery);

#[derive(MergedSubscription, Default)]
pub struct Subscription();

#[derive(MergedObject, Default)]
pub struct Mutation();

#[derive(Default)]
struct PlaceHolderQuery;
#[Object]
impl PlaceHolderQuery {
    async fn howdy(&self) -> &'static str {
        "partner"
    }
}

