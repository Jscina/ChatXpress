import { invoke } from "@tauri-apps/api/tauri";
import type {
  Assistant,
  Thread,
  Chat,
  ModelPricing,
  ChatMessage,
} from "../types";
type AssistantResponse = [string, Thread];

export async function countTokens(text: string): Promise<number> {
  return await invoke("count_tokens", { text: text });
}
export async function setOpenAIApiKey(): Promise<void> {
  try {
    await invoke("set_api_key");
  } catch (e) {
    console.error(e);
  }
}

/**
 *  Calls the python webscraper to get the latest model pricing
 *  Don't repeatedly call this function, to avoid getting ip banned
 *  Once a week or so should be fine
 */
export async function getModelPricing(): Promise<ModelPricing | null> {
  const localDate = localStorage.getItem("lastPricingCheck");
  const localPricing = localStorage.getItem("modelPricing");
  if (localDate && localPricing) {
    const lastCheck = new Date(localDate);
    const now = new Date();
    const diff = now.getTime() - lastCheck.getTime();
    const days = diff / (1000 * 3600 * 24);
    if (days < 7) {
      try {
        const pricing: ModelPricing = JSON.parse(localPricing);
        return pricing;
      } catch (e) {
        console.error(e);
      }
    }
  }
  try {
    const pricing: ModelPricing = await invoke("get_model_pricing");
    localStorage.setItem("lastPricingCheck", new Date().toString());
    localStorage.setItem("modelPricing", JSON.stringify(pricing));
    return pricing;
  } catch (e) {
    console.error(e);
    return null;
  }
}

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
  try {
    const response: AssistantResponse = await invoke("conversation", {
      prompt: prompt,
      assistant_id: assistant.id,
      thread: thread,
    });
    return {
      content: response[0],
      thread: response[1],
    } as Chat;
  } catch (e) {
    return { content: e, thread: thread } as Chat;
  }
}

export async function getHistory(thread: Thread): Promise<ChatMessage[]> {
  return await invoke("get_history", { thread_id: thread.id });
}
