mod assignments;
mod courses;
mod exams;
mod flashcards;
mod modules;
mod notes;
mod semester;
mod todos;
mod calendar;

use crate::graphql::modules::{ModuleMutation, ModuleQuery};
use crate::graphql::calendar::CalendarMutation;
use crate::graphql::semester::{SemesterMutation, SemesterQuery};
use async_graphql::*;
use todos::{TodoMutation, TodoQuery};

#[derive(MergedObject, Default)]
pub struct Query(TodoQuery, SemesterQuery, ModuleQuery);

#[derive(MergedSubscription, Default)]
pub struct Subscription();

#[derive(MergedObject, Default)]
pub struct Mutation(TodoMutation, SemesterMutation, ModuleMutation, CalendarMutation);
