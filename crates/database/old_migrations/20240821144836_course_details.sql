ALTER TABLE courses ADD COLUMN grade FLOAT;
-- TODO: make this a foreign key to the teacher table after it exists
ALTER TABLE courses ADD teacher TEXT;
ALTER TABLE courses ADD academic_department TEXT;
