use crate::APP_DATA_DIR;
use sqlx::SqlitePool;
use tokio::fs;

#[derive(Clone)]
pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new(database_url: &str) -> Database {
        let db_path = APP_DATA_DIR.join("ChatXPress").join("chatxpress.db");

        if let Some(parent) = db_path.parent() {
            if !parent.exists() {
                fs::create_dir_all(&parent).await.unwrap();
            }
        }

        if !db_path.exists() {
            fs::write(&db_path, "").await.unwrap();
        }

        let pool = SqlitePool::connect(database_url).await;
        match pool {
            Ok(p) => Database { pool: p },
            Err(e) => panic!("Error creating database pool: {}", e),
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
