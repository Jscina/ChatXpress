use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Database {
        let pool = SqlitePool::connect("sqlite:chatxpress.db").await;
        Database {
            pool: pool.unwrap(),
        }
    }

    pub async fn init(&self) -> Result<(), sqlx::Error> {
        sqlx::migrate!("./migrations").run(&self.pool).await?;
        Ok(())
    }
}
