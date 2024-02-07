use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub enum Role {
    User,
    Assistant,
}

impl Role {
    pub fn default(&self) -> String {
        match &self {
            Role::User => "user".into(),
            Role::Assistant => "assistant".into(),
        }
    }
}

#[derive(Deserialize, Serialize, Clone)]
pub struct ChatMessage {
    pub role: Role,
    pub content: String,
    pub tokens: Option<usize>,
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
    id: String,
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
            id,
            name,
            description,
            model,
            instructions,
            tools,
        }
    }
}
