use crate::{db_services::crud, models::HistoryEntry, BotState};

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_read_all(
    state: tauri::State<'_, BotState>,
) -> Result<Vec<HistoryEntry>, String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_read_all(&db).await;
    match res {
        Ok(entries) => Ok(entries),
        Err(_) => Err("Failed to read all entries".into()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_update(
    id: u32,
    thread_id: String,
    thread_name: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_update(&db, id, &thread_id, &thread_name).await;
    match res {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to update entry".into()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn history_delete(
    id: u32,
    thread_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::history_delete(&db, id, &thread_id).await;
    match res {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to delete entry".into()),
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
        Err(_) => Err("Failed to create entry".into()),
    }
}
