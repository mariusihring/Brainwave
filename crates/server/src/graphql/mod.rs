mod assignments;
mod courses;
mod exams;
mod flashcards;
mod notes;
mod semester;
mod todos;

use crate::graphql::semester::{SemesterMutation, SemesterQuery};
use async_graphql::*;
use todos::{TodoMutation, TodoQuery};

#[derive(MergedObject, Default)]
pub struct Query(TodoQuery, SemesterQuery);

#[derive(MergedSubscription, Default)]
pub struct Subscription();

#[derive(MergedObject, Default)]
pub struct Mutation(TodoMutation, SemesterMutation);
