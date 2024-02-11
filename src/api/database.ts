import { invoke } from "@tauri-apps/api/tauri";
import type { Thread, HistoryEntry } from "../types";

export async function listThreads(): Promise<Thread[]> {
  const history = (await invoke("history_read")) as HistoryEntry[];
  if (history.length === 0) return [];
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
  try {
    await invoke("history_delete", { thread_id: thread.id });
  } catch (e) {
    console.error("Thread already deleted or doesn't exist");
  } finally {
    // This might throw an error if the thread is already deleted or doesn't exist
    try {
      await invoke("delete_thread", { thread: thread });
    } catch {
      console.error("Thread already deleted");
    }
  }
}

export async function createThread(thread: Thread): Promise<void> {
  await invoke("history_create", {
    thread_id: thread.id,
    thread_name: thread.name ?? "New Chat",
  });
}
