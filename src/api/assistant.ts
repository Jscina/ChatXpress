import { invoke } from "@tauri-apps/api/tauri";
import type { Assistant } from "../types";

export async function listAssistants(): Promise<Assistant[]> {
  return await invoke("list_assistants");
}
