ALTER TABLE todos 
ADD COLUMN type TEXT CHECK(type IN ('assignment', 'exam', 'general')) DEFAULT 'general';

ALTER TABLE todos
ADD COLUMN course_id TEXT REFERENCES courses(id);
