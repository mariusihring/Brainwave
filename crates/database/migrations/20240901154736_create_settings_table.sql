CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  calendar_link TEXT,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
