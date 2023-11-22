// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate chatxpress;
use chatxpress::{assistant::*, BotState, State};
use std::sync::{Arc, Mutex};

#[tauri::command]
async fn on_close(state: tauri::State<'_, BotState>) -> Result<(), String> {
    println!("Closing");
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };

    db.pool.close().await;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(BotState(Arc::new(Mutex::new(State::new()))))
        .invoke_handler(tauri::generate_handler![
            conversation,
            get_history,
            create_assistant,
            create_thread,
            delete_thread,
            on_close
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
