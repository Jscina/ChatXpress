import { invoke } from "@tauri-apps/api";
import type { Thread } from "../types";

export async function readAllThreads(): Promise<Thread[]> {
  return await invoke("read_all_threads");
}

export async function readOneThread(thread: Thread): Promise<Thread> {
  return await invoke("read_one_thread", {
    id: thread.id,
    thread_id: thread.id,
  });
}

export async function updateThread(thread: Thread): Promise<void> {
  await invoke("update_thread", {
    thread_id: thread.id,
    thread_name: thread.name,
  });
}

export async function deleteThread(thread: Thread): Promise<void> {
  await invoke("delete_thread", { thread_id: thread.id });
}

export async function createThread(thread: Thread): Promise<Thread> {
  return await invoke("create_thread", {
    thread_id: thread.id,
    thread_name: thread.name,
  });
}
