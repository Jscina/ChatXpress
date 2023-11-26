use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub id: u32,
    pub thread_name: String,
    pub thread_id: String,
    pub created_at: String,
}
