CREATE INDEX notes_notebook_id_index ON notes (notebook_id);
CREATE INDEX flashcards_course_id_index ON flashcards (course_id);
CREATE INDEX taggables_taggable_id_taggable_table_index ON taggables (taggable_id, taggable_table);
CREATE INDEX taggables_tag_id_index ON taggables (tag_id);
CREATE INDEX calendar_entries_user_id_index ON calendar_entries (user_id);
CREATE INDEX todos_user_id_index ON todos (user_id);
CREATE INDEX notebooks_course_id_index ON notebooks (course_id);


