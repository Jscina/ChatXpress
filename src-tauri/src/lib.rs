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

#[macro_use]
extern crate lazy_static;
use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::{api::path, Config};

lazy_static! {
    pub static ref APP_DATA_DIR: PathBuf =
        path::app_data_dir(&Config::default()).expect("Cannot get app data dir");
    pub static ref DATABASE_URL: String = {
        format!(
            "sqlite:///{}",
            APP_DATA_DIR
                .join("ChatXPress")
                .join("chatxpress.db")
                .to_str()
                .expect("Path to string conversion failed"),
        )
    };
}

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
                rt.block_on(Database::new(&DATABASE_URL))
            },
        }
    }
}

pub struct BotState(pub Arc<Mutex<State>>);
