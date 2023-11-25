// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate chatxpress;
use chatxpress::{assistant::*, BotState, State};
use std::sync::{Arc, Mutex};

fn main() {
    tauri::Builder::default()
        .manage(BotState(Arc::new(Mutex::new(State::default()))))
        .invoke_handler(tauri::generate_handler![
            conversation,
            get_history,
            create_assistant,
            create_thread,
            delete_thread,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
