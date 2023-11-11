#[derive(sqlx::FromRow)]
pub struct HistoryEntry {
    pub id: u32,
    pub thread_name: String,
    pub thread_id: String,
    pub created_at: String,
}
