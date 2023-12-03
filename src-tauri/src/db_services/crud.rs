use crate::{models::HistoryEntry, schemas::Assistant, Database};
use sqlx::Error;

/// Read a thread from the database by its ID.
pub async fn history_read_one(
    db: &Database,
    id: u32,
    thread_id: &str,
) -> Result<HistoryEntry, Error> {
    let query = include_str!("./sql/history/read_one.sql");
    let result = sqlx::query_as::<_, HistoryEntry>(query)
        .bind(id)
        .bind(thread_id)
        .fetch_one(&db.pool)
        .await?;
    Ok(result)
}

/// Read all threads from the database.
pub async fn history_read_all(db: &Database) -> Result<Vec<HistoryEntry>, Error> {
    let query = include_str!("./sql/history/read_all.sql");
    let result = sqlx::query_as::<_, HistoryEntry>(query)
        .fetch_all(&db.pool)
        .await?;
    Ok(result)
}

/// Update a thread in the database.
pub async fn history_update(
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

/// Delete a thread from the database.
pub async fn history_delete(db: &Database, id: u32, thread_id: &str) -> Result<(), Error> {
    let query = include_str!("./sql/history/delete.sql");
    sqlx::query(query)
        .bind(id)
        .bind(thread_id)
        .execute(&db.pool)
        .await?;
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

pub async fn assistant_read_all(db: &Database) -> Result<Vec<Assistant>, Error> {
    let query = include_str!("./sql/assistants/read_all.sql");
    let result = sqlx::query_as::<_, Assistant>(query)
        .fetch_all(&db.pool)
        .await?;
    Ok(result)
}

pub async fn assistant_read_one(
    db: &Database,
    id: u32,
    assistant_id: &str,
) -> Result<Assistant, Error> {
    let query = include_str!("./sql/assistants/read_one.sql");
    let result = sqlx::query_as::<_, Assistant>(query)
        .bind(id)
        .bind(assistant_id)
        .fetch_one(&db.pool)
        .await?;
    Ok(result)
}

pub async fn assistant_update(
    db: &Database,
    id: u32,
    assistant_id: &str,
    assistant_name: &str,
) -> Result<(), Error> {
    let query = include_str!("./sql/assistants/update.sql");
    sqlx::query(query)
        .bind(assistant_name)
        .bind(id)
        .bind(assistant_id)
        .execute(&db.pool)
        .await?;
    Ok(())
}

pub async fn assistant_delete(db: &Database, id: u32, assistant_id: &str) -> Result<(), Error> {
    let query = include_str!("./sql/assistants/delete.sql");
    sqlx::query(query)
        .bind(id)
        .bind(assistant_id)
        .execute(&db.pool)
        .await?;
    Ok(())
}

pub async fn assistant_create(
    db: &Database,
    assistant_id: &str,
    assistant_name: &str,
) -> Result<(), Error> {
    let query = include_str!("./sql/assistants/create.sql");
    sqlx::query(query)
        .bind(assistant_id)
        .bind(assistant_name)
        .execute(&db.pool)
        .await?;
    Ok(())
}
