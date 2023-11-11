use async_openai::types::{AssistantTools, AssistantToolsCode, AssistantToolsRetrieval};

use crate::BotState;

#[tauri::command]
pub async fn delete_thread(
    thread_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), tauri::Error> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    bot.delete_thread(&thread_id).await.unwrap();
    Ok(())
}

#[tauri::command]
pub async fn create_assistant(
    name: String,
    description: String,
    model: String,
    instructions: String,
    tools: Vec<String>,
    state: tauri::State<'_, BotState>,
) -> Result<String, tauri::Error> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let assistant = bot
        .create_assistant(
            &name,
            &description,
            &model,
            &instructions,
            tools
                .iter()
                .map(|tool| match tool.as_str() {
                    "code" => AssistantTools::Code(AssistantToolsCode::default()),
                    "function" => panic!(
                        "Function tool not implemented, you can add them in the api playground."
                    ),
                    "search" => AssistantTools::Retrieval(AssistantToolsRetrieval::default()),
                    _ => panic!("Invalid tool"),
                })
                .collect(),
        )
        .await
        .unwrap();
    Ok(assistant.id)
}

#[tauri::command]
pub async fn get_history(
    thread_id: String,
    state: tauri::State<'_, BotState>,
) -> Result<(), tauri::Error> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
    };
    let history = bot.get_history(&thread_id).await.unwrap();

    history.data.iter().for_each(|message| {
        println!("{:?}: {:?}", message.role, message.content);
    });

    Ok(())
}

#[tauri::command]
pub async fn conversation(
    prompt: String,
    assistant_id: String,
    thread_id: Option<String>,
    state: tauri::State<'_, BotState>,
) -> Result<(String, String), tauri::Error> {
    let bot = {
        let state_guard = state.0.lock().unwrap();
        state_guard.bot.clone()
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
