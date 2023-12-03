use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqliteRow, FromRow, Row};

pub enum Role {
    System,
    User,
    Assistant,
    Function,
}

impl Role {
    pub fn default(&self) -> String {
        match &self {
            Role::System => "system".into(),
            Role::User => "user".into(),
            Role::Assistant => "assistant".into(),
            Role::Function => "function".into(),
        }
    }
}

#[derive(Deserialize, Serialize, Clone)]
pub enum ChatMessage {
    Role,
    Content,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct Thread {
    pub id: String,
    pub name: Option<String>,
    pub messages: Option<Vec<ChatMessage>>,
}

impl Thread {
    pub fn new(id: String, name: Option<String>, messages: Option<Vec<ChatMessage>>) -> Self {
        Self { id, name, messages }
    }
}

#[derive(Deserialize, Serialize)]
pub struct Assistant {
    id: u32,
    assistant_id: String,
    name: Option<String>,
    description: Option<String>,
    model: Option<String>,
    instructions: Option<String>,
    tools: Option<Vec<String>>,
}

impl Assistant {
    pub fn new(
        id: String,
        name: Option<String>,
        description: Option<String>,
        model: Option<String>,
        instructions: Option<String>,
        tools: Option<Vec<String>>,
    ) -> Self {
        Self {
            id: 0,
            assistant_id: id,
            name,
            description,
            model,
            instructions,
            tools,
        }
    }
}

impl<'r> FromRow<'r, SqliteRow> for Assistant {
    fn from_row(row: &'r SqliteRow) -> Result<Self, sqlx::Error> {
        Ok(Self {
            id: row.get(0),
            assistant_id: row.get(5),
            name: row.get(1),
            description: row.get(2),
            model: row.get(3),
            instructions: row.get(4),
            tools: None,
        })
    }
}
