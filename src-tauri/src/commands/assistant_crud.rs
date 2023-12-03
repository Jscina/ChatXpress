use crate::{db_services::crud, schemas::Assistant, BotState};

#[tauri::command(async, rename_all = "snake_case")]
pub async fn assistant_read_all(
    state: tauri::State<'_, BotState>,
) -> Result<Vec<Assistant>, String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::assistant_read_all(&db).await;
    match res {
        Ok(entries) => Ok(entries),
        Err(_) => Err("Failed to read all entries".into()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn assistant_read_one(
    id: u32,
    assistant_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<Assistant, String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::assistant_read_one(&db, id, &assistant_id).await;
    match res {
        Ok(entry) => Ok(entry),
        Err(_) => Err("Failed to read entry".into()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn assistant_update(
    id: u32,
    assistant_id: String,
    assistant_name: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::assistant_update(&db, id, &assistant_id, &assistant_name).await;
    match res {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to update entry".into()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn assistant_delete(
    id: u32,
    assistant_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::assistant_delete(&db, id, &assistant_id).await;
    match res {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to delete entry".into()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn assistant_create(
    assistant_id: String,
    assistant_name: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let db = {
        let state_guard = state.0.lock().unwrap();
        state_guard.db.clone()
    };
    let res = crud::assistant_create(&db, &assistant_id, &assistant_name).await;
    match res {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to create entry".into()),
    }
}
