ALTER TABLE todos 
ADD COLUMN type TEXT CHECK(type IN ('assignment', 'exam', 'general')) DEFAULT 'general';

ALTER TABLE todos
ADD COLUMN module_id TEXT REFERENCES module(id);
