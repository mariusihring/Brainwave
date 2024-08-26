ALTER TABLE todos 
ADD COLUMN type TEXT CHECK(type IN ('assignment', 'exam', 'general')) DEFAULT 'general';
ALTER TABLE todos
ADD COLUMN status TEXT CHECK(status IN ('pending', 'inprogress', 'completed')) DEFAULT 'pending' NOT NULL;

