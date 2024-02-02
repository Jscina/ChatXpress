mod openai_tools {
    pub mod chat_bot;
    pub use chat_bot::ChatBot;
}

mod commands {
    pub mod api_key_crud;
    pub mod assistant;
    pub mod history_crud;
    pub mod schemas;
}

mod db_services {
    pub mod crud;
    pub mod database;
    pub mod models;
}

pub use commands::*;
pub use db_services::crud;
pub use db_services::database::Database;
pub use db_services::models;
pub use openai_tools::ChatBot;
use std::sync::{Arc, Mutex};

pub struct State {
    pub bot: ChatBot,
    pub db: Database,
}

impl Default for State {
    fn default() -> State {
        State {
            bot: ChatBot::default(),
            db: {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(Database::new())
            },
        }
    }
}

pub struct BotState(pub Arc<Mutex<State>>);
