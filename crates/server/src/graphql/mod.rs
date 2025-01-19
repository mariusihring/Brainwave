mod assignments;
mod calendar;
mod courses;
mod exams;
mod flashcards;
mod modules;
mod notes;
mod semester;
mod todos;

use crate::graphql::calendar::{CalendarMutation, CalendarQuery};
use crate::graphql::modules::{ModuleMutation, ModuleQuery};
use crate::graphql::semester::{SemesterMutation, SemesterQuery};
use async_graphql::*;
use courses::{CourseMutation, CourseQuery};
use todos::{TodoMutation, TodoQuery};
use crate::graphql::exams::{ExamMutation, ExamQuery};

#[derive(MergedObject, Default)]
pub struct Query(
    TodoQuery,
    SemesterQuery,
    ModuleQuery,
    CalendarQuery,
    CourseQuery,
    ExamQuery
);

#[derive(MergedSubscription, Default)]
pub struct Subscription();

#[derive(MergedObject, Default)]
pub struct Mutation(
    TodoMutation,
    SemesterMutation,
    ModuleMutation,
    CalendarMutation,
    CourseMutation,
    ExamMutation
);
