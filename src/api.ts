import { invoke } from "@tauri-apps/api/tauri";
import type { Assistant, Thread, ChatMessage } from "./types";

export async function deleteThread(thread: Thread): Promise<void> {
  await invoke("delete_thread", { thread: thread });
}

export async function createAssistant(assistant: Assistant): Promise<string> {
  return await invoke("create_assistant", { assistant: assistant });
}

export async function getHistory({ id }: Thread): Promise<ChatMessage[]> {
  return await invoke("get_history", { thread_id: id });
}

export async function conversation(
  prompt: string,
  assistant: Assistant,
  thread?: Thread
): Promise<string> {
  const assistantId = assistant.id;
  return await invoke("conversation", {
    prompt: prompt,
    assistant_id: assistantId,
    thread: thread ?? null,
  });
}

export async function createThread(): Promise<Thread> {
  return await invoke("create_thread");
}
