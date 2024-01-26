import { invoke } from "@tauri-apps/api/tauri";
import type { Assistant } from "../types";

export async function listAssistants(): Promise<Assistant[]> {
  return await invoke("list_assistants");
}

export async function readApiKey(): Promise<string> {
  return await invoke("read_api_key");
}

export async function writeApiKey(apiKey: string): Promise<void> {
  return await invoke("write_api_key", { api_key: apiKey });
}
