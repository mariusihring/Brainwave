pub use sea_orm_migration::prelude::*;

mod m20241029_123444_create_user_table;
mod m20241029_123451_create_semester_table;
mod m20241029_123452_create_modules_table;
mod m20241029_123453_create_courses_table;
mod m20241029_123454_create_notebooks_table;
mod m20241029_123455_create_notes_table;
mod m20241029_123502_create_flashcards_table;
mod m20241029_123510_create_tags_table;
mod m20241029_123511_create_taggables_table;
mod m20241029_123527_create_calendar_entries_table;
mod m20241029_123541_create_flashcard_references_table;
mod m20241029_123558_create_todos_table;
mod m20241029_123610_create_todos_reference_table;
mod m20241029_123641_create_session_table;
mod m20241029_210413_add_settings_table;
mod m20241029_210743_add_appointments_table;
mod m20250105_202506_update_course_is_favorite;
mod m20250105_203557_create_exam_table;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20241029_123444_create_user_table::Migration),
            Box::new(m20241029_123451_create_semester_table::Migration),
            Box::new(m20241029_123452_create_modules_table::Migration),
            Box::new(m20241029_123453_create_courses_table::Migration),
            Box::new(m20241029_123454_create_notebooks_table::Migration),
            Box::new(m20241029_123455_create_notes_table::Migration),
            Box::new(m20241029_123502_create_flashcards_table::Migration),
            Box::new(m20241029_123510_create_tags_table::Migration),
            Box::new(m20241029_123511_create_taggables_table::Migration),
            Box::new(m20241029_123527_create_calendar_entries_table::Migration),
            Box::new(m20241029_123541_create_flashcard_references_table::Migration),
            Box::new(m20241029_123558_create_todos_table::Migration),
            Box::new(m20241029_123610_create_todos_reference_table::Migration),
            Box::new(m20241029_123641_create_session_table::Migration),
            Box::new(m20241029_210413_add_settings_table::Migration),
            Box::new(m20241029_210743_add_appointments_table::Migration),
            Box::new(m20250105_202506_update_course_is_favorite::Migration),
            Box::new(m20250105_203557_create_exam_table::Migration)
        ]
    }
}
