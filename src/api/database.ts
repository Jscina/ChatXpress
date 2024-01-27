import { invoke } from "@tauri-apps/api/tauri";
import type { Thread, HistoryEntry } from "../types";

export async function listThreads(): Promise<Thread[]> {
  const history = (await invoke("history_read_all")) as HistoryEntry[];
  return history.map((entry) => {
    return { id: entry.thread_id, name: entry.thread_name } as Thread;
  });
}

export async function updateThread(thread: Thread): Promise<void> {
  return await invoke("history_update", {
    thread_id: thread.id,
    thread_name: thread.name ?? "New Chat",
  });
}

export async function deleteThread(thread: Thread): Promise<void> {
  await invoke("delete_thread", thread);
  return await invoke("history_delete", { thread_id: thread.id });
}

export async function createThread(thread: Thread): Promise<void> {
  await invoke("create_thread", {
    thread_id: thread.id,
    thread_name: thread.name ?? "New Chat",
  });
}
