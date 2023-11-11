// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate chatxpress;
use chatxpress::{assistant, BotState, State};
use std::sync::{Arc, Mutex};

fn main() {
    tauri::Builder::default()
        .manage(BotState(Arc::new(Mutex::new(State::new()))))
        .invoke_handler(tauri::generate_handler![assistant::conversation])
        .invoke_handler(tauri::generate_handler![assistant::create_assistant])
        .invoke_handler(tauri::generate_handler![assistant::delete_thread])
        .invoke_handler(tauri::generate_handler![assistant::get_history])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
