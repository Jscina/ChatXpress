CREATE TABLE IF NOT EXISTS assistants {
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assistant_name TEXT NOT NULL,
    description TEXT NOT NULL,
    model TEXT NOT NULL,
    instructions TEXT NOT NULL,
    assistant_id TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
}