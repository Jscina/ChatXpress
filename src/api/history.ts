import { invoke } from "@tauri-apps/api";
import type { Thread } from "../types";

export async function getHistory(): Promise<string> {
  return await invoke("get_history");
}

// Doesn't belong here, just to satisfy the linter
export async function deleteThread(thread: Thread): Promise<void> {
  await invoke("delete_thread", { thread: thread });
}
