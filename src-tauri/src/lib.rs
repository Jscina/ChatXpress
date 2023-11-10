mod openai_tools {
    pub mod chat_bot;
    pub use chat_bot::ChatBot;
}

pub use openai_tools::ChatBot;
use std::sync::{Arc, Mutex};

pub struct BotState(pub Arc<Mutex<ChatBot>>);
