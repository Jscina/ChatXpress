import { invoke } from "@tauri-apps/api/tauri";
import type { Assistant, Thread, Chat, ChatMessage } from "../types";
type AssistantResponse = [string, Thread];

export async function listAssistants(): Promise<Assistant[]> {
  return await invoke("list_assistants");
}

export async function readApiKey(): Promise<string> {
  return await invoke("read_api_key");
}

export async function updateApiKey(apiKey: string): Promise<void> {
  return await invoke("update_api_key", { api_key: apiKey });
}

export async function deleateThread(thread: Thread): Promise<void> {
  return await invoke("delete_thread", thread);
}

export async function conversation(
  prompt: string,
  assistant: Assistant,
  thread?: Thread,
): Promise<Chat> {
  if (prompt === "") return { content: "", thread: thread } as Chat;
  const response: AssistantResponse = await invoke("conversation", {
    prompt: prompt,
    assistant_id: assistant.id,
    thread: thread,
  });
  return {
    content: response[0],
    thread: response[1],
  } as Chat;
}

export async function getHistory(thread: Thread): Promise<ChatMessage[]> {
  return await invoke("get_history", { thread_id: thread.id });
}
