ALTER TABLE todos 
ADD COLUMN type TEXT CHECK(type IN ('assignment', 'exam', 'general'));

ALTER TABLE todos
ADD COLUMN course_id TEXT REFERENCES courses(id);
