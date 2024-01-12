use sqlx::SqlitePool;
use tokio::fs;

#[derive(Clone)]
pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Database {
        let pool = SqlitePool::connect("sqlite:chatxpress.db").await;
        Database {
            pool: match pool {
                Ok(pool) => pool,
                Err(_) => {
                    fs::write("chatxpress.db", "").await.unwrap();
                    SqlitePool::connect("sqlite:chatxpress.db").await.unwrap()
                }
            },
        }
    }

    pub async fn init(&self) -> Result<(), sqlx::Error> {
        sqlx::migrate!("./migrations").run(&self.pool).await?;
        Ok(())
    }
}
