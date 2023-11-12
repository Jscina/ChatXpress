mod openai_tools {
    pub mod chat_bot;
    pub use chat_bot::ChatBot;
}

mod commands {
    pub mod assistant;
    pub mod schemas;
}

mod database {
    pub mod crud;
    pub mod database;
    pub mod models;
}

pub use commands::*;
pub use database::crud;
pub use database::database::Database;
pub use database::models;
pub use openai_tools::ChatBot;
use std::sync::{Arc, Mutex};
use tokio;

pub struct State {
    pub bot: ChatBot,
    pub db: Database,
}

impl State {
    pub fn new() -> State {
        State {
            bot: ChatBot::new(),
            db: {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(Database::new())
            },
        }
    }
}

pub struct BotState(pub Arc<Mutex<State>>);
