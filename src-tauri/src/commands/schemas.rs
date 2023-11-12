use serde::{Deserialize, Serialize};

pub enum Role {
    System,
    User,
    Assistant,
    Function,
}

impl Role {
    pub fn default(&self) -> String {
        match &self {
            Role::System => "system".to_string(),
            Role::User => "user".to_string(),
            Role::Assistant => "assistant".to_string(),
            Role::Function => "function".to_string(),
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
