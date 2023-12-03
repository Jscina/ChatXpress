import { invoke } from "@tauri-apps/api/tauri";
import type { Assistant, Thread } from "../types";

export async function deleteThread(thread: Thread): Promise<void> {
  await invoke("delete_thread", { thread: thread });
}

export async function createAssistant(assistant: Assistant): Promise<string> {
  return await invoke("create_assistant", { ...assistant });
}

export async function conversation(
  prompt: string,
  assistant: Assistant,
  thread?: Thread
): Promise<[string, Thread]> {
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

export async function getHistory(thread: Thread): Promise<string[]> {
  return await invoke("get_history", { thread_id: thread.id });
}
