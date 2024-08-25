CREATE TABLE notes
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       VARCHAR(255) NOT NULL,
    content     TEXT,
    notebook_id INTEGER      NOT NULL,
    FOREIGN KEY (notebook_id) REFERENCES notebooks (id)
);
CREATE INDEX notes_notebook_id_index ON notes (notebook_id);

CREATE TABLE flashcards
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    question  TEXT    NOT NULL,
    answer    TEXT    NOT NULL,
    course_id INTEGER NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (id)
);
CREATE INDEX flashcards_course_id_index ON flashcards (course_id);

CREATE TABLE taggables
(
    tag_id         INTEGER      NOT NULL,
    taggable_id    INTEGER      NOT NULL,
    taggable_table VARCHAR(255) NOT NULL,
    PRIMARY KEY (tag_id, taggable_id, taggable_table),
    FOREIGN KEY (tag_id) REFERENCES tags (id)
);
CREATE INDEX taggables_taggable_id_taggable_table_index ON taggables (taggable_id, taggable_table);
CREATE INDEX taggables_tag_id_index ON taggables (tag_id);

CREATE TABLE tags
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL
);

CREATE TABLE calendar_entries
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      VARCHAR(255) NOT NULL,
    location   VARCHAR(255) NOT NULL,
    details    VARCHAR(255) NOT NULL,
    start_date DATE         NOT NULL,
    end_date   DATE         NOT NULL,
    user_id    TEXT         NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);
CREATE INDEX calendar_entries_user_id_index ON calendar_entries (user_id);

CREATE TABLE flashcard_references
(
    flashcard_id    INTEGER      NOT NULL,
    reference_id    INTEGER      NOT NULL,
    reference_table VARCHAR(255) NOT NULL,
    PRIMARY KEY (flashcard_id, reference_id, reference_table),
    FOREIGN KEY (flashcard_id) REFERENCES flashcards (id)
);

CREATE TABLE modules
(
    id             TEXT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    ects          INTEGER      NOT NULL,
    grade          FLOAT,
    start_semester TEXT         NOT NULL,
    end_semester   TEXT         NOT NULL,
    user_id        TEXT         NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (start_semester) references semester (id),
    FOREIGN KEY (end_semester) references semester (id)
);

CREATE TABLE todos
(
    id      TEXT PRIMARY KEY,
    title   VARCHAR(255) NOT NULL,
    due_on  DATE         NOT NULL,
    user_id TEXT         NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);
CREATE INDEX todos_user_id_index ON todos (user_id);

CREATE TABLE assignments
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    due_on       DATE         NOT NULL,
    grade        REAL,
    course_id    TEXT         NOT NULL,
    weight_grade REAL         NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (id)
);
CREATE INDEX assignments_course_id_index ON assignments (course_id);

CREATE TABLE user
(
    id            TEXT PRIMARY KEY NOT NULL,
    first_name    VARCHAR(255),
    last_name     VARCHAR(255),
    image         TEXT,
    username      TEXT UNIQUE      NOT NULL,
    password_hash TEXT             NOT NULL
);

CREATE TABLE todo_references
(
    todo_id         INTEGER      NOT NULL,
    reference_id    INTEGER      NOT NULL,
    reference_table VARCHAR(255) NOT NULL,
    PRIMARY KEY (todo_id, reference_id, reference_table),
    FOREIGN KEY (todo_id) REFERENCES todos (id)
);

CREATE TABLE notebooks
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      VARCHAR(255) NOT NULL,
    course_id TEXT         NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (id)
);
CREATE INDEX notebooks_course_id_index ON notebooks (course_id);

CREATE TABLE courses
(
    id        TEXT PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    module_id TEXT         NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (module_id) REFERENCES modules (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE IF NOT EXISTS session
(
    id         TEXT    NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id    TEXT    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
)
