// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate chatxpress;
use chatxpress::{assistant::*, history_crud::*, BotState, Database, State};
use std::sync::{Arc, Mutex};
use tokio::runtime::Runtime;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            let rt = Runtime::new().unwrap();
            rt.block_on(async {
                let db = Database::new().await;
                db.init().await.expect("error initializing database");
                db.pool.close().await;
            });
            Ok(())
        })
        .manage(BotState(Arc::new(Mutex::new(State::default()))))
        .invoke_handler(tauri::generate_handler![
            conversation,
            get_history,
            create_assistant,
            create_thread,
            delete_thread,
            history_read_one,
            history_read_all,
            history_update,
            history_delete
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
