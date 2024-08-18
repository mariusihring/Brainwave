ALTER TABLE 'todos' (
  type TEXT CHECK(type in ('assignment', 'exam', 'general')) NOT NULL,
  course_id TEXT,
  FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
);
