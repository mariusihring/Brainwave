CREATE TABLE semester
(
    id            TEXT PRIMARY KEY NOT NULL,
    --     semester hash is userid_semester and can happen only once
    semester_hash TEXT             NOT NULL UNIQUE,
    semester      INT              NOT NULL,
    start_date    DATE             NOT NULL,
    end_date      DATE             NOT NULL,
    total_ects    INT              NOT NULL,
    user_id       TEXT             NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);