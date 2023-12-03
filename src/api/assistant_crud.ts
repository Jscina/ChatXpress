import { invoke } from "@tauri-apps/api/tauri";
import type { Assistant } from "../types";

export async function readAllAssistants(): Promise<Assistant[]> {
  return await invoke("read_all_assistants");
}

export async function readOneAssistant(
  assistant: Assistant
): Promise<Assistant> {
  return await invoke("read_one_assistant", {
    id: assistant.id,
    assistant_id: assistant.assistant_id,
  });
}

export async function updateAssistant(assistant: Assistant): Promise<void> {
  await invoke("update_assistant", {
    assistant_id: assistant.assistant_id,
    assistant_name: assistant.name,
  });
}

export async function deleteAssistant(assistant: Assistant): Promise<void> {
  await invoke("delete_assistant", { assistant_id: assistant.id });
}

export async function createAssistant(
  assistant: Assistant
): Promise<Assistant> {
  return await invoke("create_assistant", {
    assistant_id: assistant.assistant_id,
    assistant_name: assistant.name,
  });
}
