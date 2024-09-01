-- Add migration script here
CREATE TABLE appointment (
                             id TEXT PRIMARY KEY,
                             date DATE NOT NULL,
                             name TEXT NOT NULL,
                             start_time DATETIME NOT NULL,
                             end_time DATETIME NOT NULL,
                             location TEXT,
                             course_id TEXT REFERENCES courses(id),
                             is_canceled BOOLEAN DEFAULT FALSE,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

ALTER TABLE semester ADD COLUMN imported_appointments BOOLEAN DEFAULT FALSE;