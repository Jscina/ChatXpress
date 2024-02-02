// Prevents additional console window on Windows in release, DO NOT REMOVE!! #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")] extern crate chatxpress;
use chatxpress::{api_key_crud::*, assistant::*, history_crud::*, BotState, Database, State};

use std::{
    env,
    sync::{Arc, Mutex},
};
use tokio::runtime::Runtime;

const DATABASE_URL: &str = "sqlite:chatxpress.db";

fn main() {
    env::set_var("DATABASE_URL", DATABASE_URL);
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
            list_assistants,
            delete_thread,
            history_read,
            history_create,
            history_update,
            history_delete,
            read_api_key,
            update_api_key,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
