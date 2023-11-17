use sqlx::SqlitePool;

#[derive(Clone)]
pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Database {
        let pool = SqlitePool::connect("sqlite:chatxpress.db").await;
        match pool {
            Ok(pool) => {
                let database = Database { pool };
                database.init().await;
                database
            }
            Err(_) => {
                panic!("Failed to connect to the database");
            }
        }
    }

    pub async fn init(&self) {
        let queries = vec![
            include_str!("./sql/init/create_history_table.sql"),
            include_str!("./sql/init/create_assistants_table.sql"),
        ];
        for query in queries {
            sqlx::query(query).execute(&self.pool).await.unwrap();
        }
    }
}
