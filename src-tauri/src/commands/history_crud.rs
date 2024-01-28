use crate::{db_services::crud, models::HistoryEntry, BotState};

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_read(state: tauri::State<'_, BotState>) -> Result<Vec<HistoryEntry>, String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_read(&db).await;
    match res {
        Ok(entries) => Ok(entries),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_update(
    thread_id: String,
    thread_name: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_update(&db, &thread_id, &thread_name).await;
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_delete(
    thread_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_delete(&db, &thread_id).await;
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_create(
    thread_id: String,
    thread_name: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_create(&db, &thread_id, &thread_name).await;
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
