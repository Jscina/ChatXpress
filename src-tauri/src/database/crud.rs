use crate::{models::HistoryEntry, Database};
use sqlx::Error;

pub async fn read_one(db: &Database, id: u32, thread_id: &str) -> Result<HistoryEntry, Error> {
    let query = include_str!("./sql/history/read_one.sql");
    let result = sqlx::query_as::<_, HistoryEntry>(query)
        .bind(id)
        .bind(thread_id)
        .fetch_one(&db.pool)
        .await?;
    Ok(result)
}

pub async fn read_all(db: &Database) -> Result<Vec<HistoryEntry>, Error> {
    let query = include_str!("./sql/history/read_all.sql");
    let result = sqlx::query_as::<_, HistoryEntry>(query)
        .fetch_all(&db.pool)
        .await?;
    Ok(result)
}

pub async fn update(
    db: &Database,
    id: u32,
    thread_id: &str,
    thread_name: &str,
) -> Result<(), Error> {
    let query = include_str!("./sql/history/update.sql");
    sqlx::query(query)
        .bind(thread_name)
        .bind(id)
        .bind(thread_id)
        .execute(&db.pool)
        .await?;
    Ok(())
}

pub async fn delete(db: &Database, id: u32, thread_id: &str) -> Result<(), Error> {
    let query = include_str!("./sql/history/delete.sql");
    sqlx::query(query)
        .bind(id)
        .bind(thread_id)
        .execute(&db.pool)
        .await?;
    Ok(())
}
