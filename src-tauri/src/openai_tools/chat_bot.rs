use async_openai::{
    config::OpenAIConfig,
    error::OpenAIError,
    types::{
        AssistantObject, AssistantTools, CreateAssistantRequestArgs, CreateMessageRequestArgs,
        CreateRunRequestArgs, CreateThreadRequestArgs, MessageContent, RunObject, RunStatus,
        ThreadObject,
    },
    Client,
};

#[derive(Clone)]
pub struct ChatBot {
    pub client: Client<OpenAIConfig>,
    pub active_thread_id: Option<String>,
}

impl ChatBot {
    pub fn new() -> ChatBot {
        ChatBot {
            client: Client::new(),
            active_thread_id: None,
        }
    }

    pub async fn create_assistant(
        &self,
        name: &str,
        description: &str,
        model: &str,
        instructions: &str,
        tools: Vec<AssistantTools>,
    ) -> Result<AssistantObject, OpenAIError> {
        let assistant_request = CreateAssistantRequestArgs::default()
            .name(name)
            .description(description)
            .model(model)
            .instructions(instructions)
            .tools(tools)
            .build()?;

        let assistant = self.client.assistants().create(assistant_request).await?;
        Ok(assistant)
    }

    pub async fn retrieve_assistant(
        &self,
        assistant_id: &str,
    ) -> Result<AssistantObject, OpenAIError> {
        let assistant = self.client.assistants().retrieve(assistant_id).await?;
        Ok(assistant)
    }

    pub async fn create_thread(&self) -> Result<ThreadObject, OpenAIError> {
        let thread = self
            .client
            .threads()
            .create(CreateThreadRequestArgs::default().build()?)
            .await?;
        Ok(thread)
    }

    pub async fn create_run(
        &self,
        thread_id: &str,
        assistant_id: &str,
    ) -> Result<RunObject, OpenAIError> {
        let run_request = CreateRunRequestArgs::default()
            .assistant_id(assistant_id)
            .build()?;
        let run = self
            .client
            .threads()
            .runs(thread_id)
            .create(run_request)
            .await?;
        Ok(run)
    }

    pub async fn add_message_to_thread(
        &self,
        thread_id: &str,
        prompt: &str,
    ) -> Result<(), OpenAIError> {
        // Create a new message within the thread
        let message_request = CreateMessageRequestArgs::default()
            .role("user")
            .content(prompt)
            .build()?;

        // Add message to thread, don't need the object back
        self.client
            .threads()
            .messages(thread_id)
            .create(message_request)
            .await?;
        Ok(())
    }

    pub async fn delete_thread(&self, thread_id: &str) -> Result<(), OpenAIError> {
        self.client.threads().delete(thread_id).await?;
        Ok(())
    }

    pub async fn retrieve_thread(&self, thread_id: &str) -> Result<ThreadObject, OpenAIError> {
        let thread = self.client.threads().retrieve(thread_id).await?;
        Ok(thread)
    }

    async fn poll_thread(&self, run: &mut RunObject, thread_id: &str) -> Result<bool, OpenAIError> {
        loop {
            match run.status {
                RunStatus::Queued | RunStatus::InProgress => {
                    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                    *run = self
                        .client
                        .threads()
                        .runs(thread_id)
                        .retrieve(&run.id)
                        .await?;
                }
                _ => break,
            }
        }
        Ok(true)
    }

    pub async fn get_assistant_response(
        &self,
        run: &mut RunObject,
        thread_id: &str,
    ) -> Result<String, OpenAIError> {
        while !self.poll_thread(run, thread_id).await? {
            continue;
        }
        let query = [("limt", "1")];
        let messages = self
            .client
            .threads()
            .messages(thread_id)
            .list(&query)
            .await?;
        for message in messages.data[0].content.iter() {
            match message {
                MessageContent::Text(text) => {
                    return Ok(text.text.value.clone());
                }
                _ => continue,
            }
        }
        Ok("".to_string())
    }
}
