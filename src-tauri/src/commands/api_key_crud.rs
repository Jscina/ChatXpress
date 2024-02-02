use crate::{db_services::crud, BotState};
use std::env;

#[tauri::command(async, rename_all = "snake_case")]
pub async fn read_api_key(state: tauri::State<'_, BotState>) -> Result<String, String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };

    let api_key = crud::read_api_key(&db).await;

    match api_key {
        Ok(api_key) => {
            env::set_var("OPENAI_API_KEY", &api_key);
            Ok(api_key)
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn update_api_key(
    state: tauri::State<'_, BotState>,
    api_key: String,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };

    let res = crud::update_api_key(&db, &api_key).await;
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
