// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate chatxpress;
use chatxpress::{
    api_key_crud::*, assistant::*, history_crud::*, BotState, Database, State, DATABASE_URL,
};
use std::sync::{Arc, Mutex};
use tokio::runtime::Runtime;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            let rt = Runtime::new().unwrap();
            rt.block_on(async {
                let db = Database::new(&DATABASE_URL).await;
                db.init().await.expect("error initializing database");
                db.pool.close().await;
            });
            Ok(())
        })
        .manage(BotState(Arc::new(Mutex::new(State::default()))))
        .invoke_handler(tauri::generate_handler![
            conversation,
            get_history,
            list_assistants,
            delete_thread,
            history_read,
            history_create,
            history_update,
            history_delete,
            read_api_key,
            update_api_key,
            count_tokens,
            count_total_tokens,
            set_api_key,
            get_model_pricing
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
