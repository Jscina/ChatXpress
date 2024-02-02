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
        let write_query = include_str!("./sql/api_key/create.sql");
        let read_query = include_str!("./sql/api_key/read.sql");
        sqlx::migrate!("./migrations").run(&self.pool).await?;
        let res = sqlx::query(read_query).fetch_one(&self.pool).await;
        if res.is_err() {
            sqlx::query(write_query)
                .bind("")
                .execute(&self.pool)
                .await?;
        }
        Ok(())
    }
}
