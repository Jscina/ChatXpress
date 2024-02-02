use crate::{
    schemas::{Assistant, Thread},
    BotState,
};

use async_openai::types::{MessageContent, MessageRole};
use std::collections::HashMap;
use tokio::fs;

#[tauri::command(async, rename_all = "snake_case")]
pub async fn delete_thread(
    thread: Thread,
    state: tauri::State<'_, BotState>,
) -> Result<(), String> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let res = bot.delete_thread(&thread.id).await;
    match res {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn get_history(
    thread_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<Vec<HashMap<String, String>>, String> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let history = bot.get_history(&thread_id).await;
    match history {
        Ok(history) => {
            let history = history
                .data
                .iter()
                .map(|message| {
                    let role = match message.role {
                        MessageRole::User => "user",
                        MessageRole::Assistant => "assistant",
                    }
                    .to_string();

                    let content = message
                        .content
                        .iter()
                        .map(|content| match content {
                            MessageContent::Text(text) => text.text.value.clone(),
                            _ => "".into(),
                        })
                        .collect::<Vec<String>>()
                        .join("");
                    (role, content)
                })
                .collect::<Vec<(String, String)>>()
                .iter()
                .map(|(role, content)| {
                    let mut map = HashMap::new();
                    map.insert("role".into(), role.clone());
                    map.insert("content".into(), content.clone());
                    map
                })
                .collect();
            Ok(history)
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn conversation(
    prompt: String,
    assistant_id: String,
    thread: Option<Thread>,
    state: tauri::State<'_, BotState>,
) -> Result<(String, Thread), String> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let assistant = bot.retrieve_assistant(&assistant_id).await.unwrap();
    let thread_copy = thread.clone();
    let thread_obj = match thread {
        Some(thread) => bot.retrieve_thread(&thread.id).await.unwrap(),
        None => bot.create_thread().await.unwrap(),
    };

    bot.add_message_to_thread(&thread_obj.id, &prompt)
        .await
        .unwrap();

    let mut run = bot.create_run(&thread_obj.id, &assistant.id).await.unwrap();
    let response = bot.get_assistant_response(&mut run, &thread_obj.id).await;
    match response {
        Ok(response) => Ok((
            response,
            thread_copy.unwrap_or(Thread::new(thread_obj.id, None, None)),
        )),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn list_assistants(state: tauri::State<'_, BotState>) -> Result<Vec<Assistant>, String> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let res = bot
        .list_assistants()
        .await
        .map_err(|e| e.to_string())?
        .iter()
        .map(|x| {
            Assistant::new(
                x.id.clone(),
                x.name.clone(),
                x.description.clone(),
                Some(x.model.clone()),
                x.instructions.clone(),
                None,
            )
        })
        .collect::<Vec<Assistant>>();
    Ok(res)
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn read_api_key() -> Result<String, String> {
    let api_key = std::env::var("OPENAI_API_KEY");
    match api_key {
        Ok(api_key) => Ok(api_key),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command(async, rename_all = "snake_case")]
pub async fn write_api_key(api_key: String) -> Result<(), String> {
    let res = fs::write(
        "../.env",
        format!("DATABASE_URL = sqlite://chatxpress.db\nOPENAI_API_KEY = {api_key}"),
    )
    .await;
    match res {
        Ok(_) => {
            std::env::set_var("OPENAI_API_KEY", api_key);
            Ok(())
        }
        Err(e) => Err(e.to_string()),
    }
}
