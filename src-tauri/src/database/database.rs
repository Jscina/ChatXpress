use sqlx::SqlitePool;

pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Database {
        let pool = SqlitePool::connect("sqlite:chatxpress.db").await.unwrap();
        Database { pool }
    }

    pub async fn init(&self) {}
}
