CREATE TABLE
    IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assistant_id INTEGER FOREIGN KEY REFERENCES assistants (id),
        thread_name TEXT NOT NULL,
        thread_id TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );