use crate::{
    crud::read_api_key,
    run_scraper,
    schemas::{Assistant, ChatMessage, Role, Thread},
    BotState, ModelPricing,
};

use async_openai::types::{MessageContent, MessageRole};
use rayon::prelude::*;
use std::collections::HashMap;
use tiktoken_rs::cl100k_base;

#[tauri::command(async, rename_all = "snake_case")]
pub async fn get_model_pricing() -> Result<HashMap<String, ModelPricing>, String> {
    let res = run_scraper().await;
    match res {
        Ok(prices) => Ok(prices),
        Err(e) => Err(e.to_string()),
    }
}

/// Calculates the number of tokens in a message and adds the tokens to the message
/// Returns the history with the tokens
#[tauri::command(async, rename_all = "snake_case")]
pub async fn count_tokens(history: Vec<ChatMessage>) -> Vec<ChatMessage> {
    let bpe = cl100k_base().unwrap();
    history
        .into_par_iter()
        .map(|mut msg| {
            if msg.tokens.is_none() {
                let tokens = bpe.encode_with_special_tokens(&msg.content).len();
                msg.tokens = Some(tokens);
            }
            msg
        })
        .collect()
}

/// Calculates the total input and output tokens in a conversation
/// Returns a tuple of the input and output tokens
#[tauri::command(async, rename_all = "snake_case")]
pub async fn count_total_tokens(history: Vec<ChatMessage>) -> (usize, usize) {
    let bpe = cl100k_base().unwrap();

    let calc_tokens = |_role: Role| {
        history
            .par_iter()
            .filter_map(|msg| {
                if matches!(&msg.role, _role) {
                    if let Some(tokens) = msg.tokens {
                        return Some(tokens);
                    }
                    Some(bpe.encode_with_special_tokens(&msg.content).len())
                } else {
                    None
                }
            })
            .sum()
    };
    let input_tokens = calc_tokens(Role::User);
    let output_tokens = calc_tokens(Role::Assistant);
    (input_tokens, output_tokens)
}

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
                .par_iter()
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
                .par_iter()
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
    let assistant = bot.retrieve_assistant(&assistant_id).await;
    let assistant = match assistant {
        Ok(assistant) => assistant,
        Err(e) => return Err(e.to_string()),
    };
    let thread_copy = thread.clone();
    let thread_obj = match thread {
        Some(thread) => bot.retrieve_thread(&thread.id).await,
        None => bot.create_thread().await,
    };

    let thread_obj = match thread_obj {
        Ok(thread) => thread,
        Err(e) => return Err(e.to_string()),
    };
    let res = bot.add_message_to_thread(&thread_obj.id, &prompt).await;

    if let Err(e) = res {
        return Err(e.to_string());
    }

    let run = bot.create_run(&thread_obj.id, &assistant.id).await;
    let mut run = match run {
        Ok(run) => run,
        Err(e) => return Err(e.to_string()),
    };
    let response = bot.get_assistant_response(&mut run, &thread_obj.id).await;
    match response {
        Ok(response) => Ok((
            response,
            thread_copy.unwrap_or(Thread::new(thread_obj.id, None, None)),
        )),
        Err(e) => Err(e.to_string()),
    }
}

/// Sets the API key for the bot from the database
#[tauri::command(async, rename_all = "snake_case")]
pub async fn set_api_key(state: tauri::State<'_, BotState>) -> Result<(), String> {
    let mut bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let db = state.0.lock().unwrap().db.clone();
    let api_key = read_api_key(&db).await;
    match api_key {
        Ok(key) => {
            bot.set_api_key(&key);
            // Need to mutate the state to set the bot with the api key
            state.0.lock().unwrap().bot = bot.clone();
            Ok(())
        }
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
