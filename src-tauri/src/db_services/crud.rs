use crate::{models::HistoryEntry, Database};
use sqlx::{Error, Row};

pub async fn read_api_key(db: &Database) -> Result<String, Error> {
    let query = include_str!("./sql/api_key/read.sql");
    let result = sqlx::query(query).fetch_one(&db.pool).await?;

    Ok(result.get(0))
}

pub async fn write_api_key(db: &Database, api_key: &str) -> Result<(), Error> {
    let query = include_str!("./sql/api_key/create.sql");
    sqlx::query(query).bind(api_key).execute(&db.pool).await?;
    Ok(())
}

pub async fn update_api_key(db: &Database, api_key: &str) -> Result<(), Error> {
    let query = include_str!("./sql/api_key/update.sql");
    sqlx::query(query).bind(api_key).execute(&db.pool).await?;
    Ok(())
}

/// Read all threads from the database.
pub async fn history_read(db: &Database) -> Result<Vec<HistoryEntry>, Error> {
    let query = include_str!("./sql/history/read.sql");
    let result = sqlx::query_as::<_, HistoryEntry>(query)
        .fetch_all(&db.pool)
        .await?;
    Ok(result)
}

/// Update a thread in the database.
pub async fn history_update(
    db: &Database,
    thread_id: &str,
    thread_name: &str,
) -> Result<(), Error> {
    let query = include_str!("./sql/history/update.sql");
    sqlx::query(query)
        .bind(thread_name)
        .bind(thread_id)
        .execute(&db.pool)
        .await?;
    Ok(())
}

/// Delete a thread from the database.
pub async fn history_delete(db: &Database, thread_id: &str) -> Result<(), Error> {
    let query = include_str!("./sql/history/delete.sql");
    sqlx::query(query).bind(thread_id).execute(&db.pool).await?;
    Ok(())
}

pub async fn history_create(
    db: &Database,
    thread_id: &str,
    thread_name: &str,
) -> Result<(), Error> {
    let query = include_str!("./sql/history/create.sql");
    sqlx::query(query)
        .bind(thread_id)
        .bind(thread_name)
        .execute(&db.pool)
        .await?;
    Ok(())
}
