pub use sea_orm_migration::prelude::*;


mod m20241029_123444_create_user_table;
mod m20241029_123455_create_notes_table;
mod m20241029_123502_create_flashcards_table;
mod m20241029_123511_create_taggables_table;
mod m20241029_123519_create_tags_table;
mod m20241029_123527_create_calendar_entries_table;
mod m20241029_123541_create_flashcard_references_table;
mod m20241029_123549_create_modules_table;
mod m20241029_123558_create_todos_table;
mod m20241029_123610_create_todos_reference_table;
mod m20241029_123619_create_notebooks_table;
mod m20241029_123629_create_courses_table;
mod m20241029_123641_create_session_table;
mod m20241029_135735_create_semester_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20241029_123444_create_user_table::Migration),
            Box::new(m20241029_123455_create_notes_table::Migration),
            Box::new(m20241029_123502_create_flashcards_table::Migration),
            Box::new(m20241029_123511_create_taggables_table::Migration),
            Box::new(m20241029_123519_create_tags_table::Migration),
            Box::new(m20241029_123527_create_calendar_entries_table::Migration),
            Box::new(m20241029_123541_create_flashcard_references_table::Migration),
            Box::new(m20241029_123549_create_modules_table::Migration),
            Box::new(m20241029_123558_create_todos_table::Migration),
            Box::new(m20241029_123610_create_todos_reference_table::Migration),
            Box::new(m20241029_123619_create_notebooks_table::Migration),
            Box::new(m20241029_123629_create_courses_table::Migration),
            Box::new(m20241029_123641_create_session_table::Migration),
            Box::new(m20241029_135735_create_semester_table::Migration),
        ]
    }
}
