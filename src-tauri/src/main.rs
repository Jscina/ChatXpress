// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate chatxpress;
use chatxpress::{BotState, ChatBot};
use std::sync::{Arc, Mutex};
use tauri;

#[tauri::command]
async fn delete_thread<'a>(
    thread_id: String,
    state: tauri::State<'a, BotState>,
) -> Result<(), tauri::Error> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.clone()
    };
    bot.delete_thread(&thread_id).await.unwrap();
    Ok(())
}

#[tauri::command]
async fn conversation<'a>(
    prompt: String,
    assistant_id: String,
    thread_id: Option<String>,
    state: tauri::State<'a, BotState>,
) -> Result<(String, String), tauri::Error> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.clone()
    };
    let assistant = bot.retrieve_assistant(&assistant_id).await.unwrap();
    let thread = match thread_id {
        Some(id) => bot.retrieve_thread(&id).await.unwrap(),
        None => bot.create_thread().await.unwrap(),
    };

    bot.add_message_to_thread(&thread.id, &prompt)
        .await
        .unwrap();

    let mut run = bot.create_run(&thread.id, &assistant.id).await.unwrap();
    let response = bot
        .get_assistant_response(&mut run, &thread.id)
        .await
        .unwrap();

    Ok((response, thread.id))
}

fn main() {
    tauri::Builder::default()
        .manage(BotState(Arc::new(Mutex::new(ChatBot::new()))))
        .invoke_handler(tauri::generate_handler![conversation])
        .invoke_handler(tauri::generate_handler![delete_thread])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
