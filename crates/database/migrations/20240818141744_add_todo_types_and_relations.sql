ALTER TABLE todos 
ADD COLUMN type TEXT CHECK(type IN ('assignment', 'exam', 'general')) DEFAULT 'general';

