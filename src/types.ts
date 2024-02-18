export enum AIRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  FUNCTION = "function",
}

export type ChatMessage = {
  role: AIRole;
  content: string;
  tokens?: number;
};

export type Assistant = {
  id: string;
  name: string;
  description: string;
  model: string;
  instructions: string;
  tools?: string[];
};

export type Thread = {
  id: string;
  name?: string;
  messages?: ChatMessage[];
};

export type AssistantResponse = [string, Thread];

export type Chat = {
  content: string;
  thread: Thread;
};

export type HistoryEntry = {
  id: number;
  thread_id: string;
  thread_name: string;
  created_at: string;
};

export type Pricing = {
  input: number;
  output: number;
};

export type ModelPricing = {
  [key: string]: Pricing;
};

export type Error = {
  title: string;
  message: string;
};

export type ChatStore = {
  assistantResponse: string;
  currentMessage: string;
  activeAssistant: Assistant | null;
  activeThread: Thread | null;
  chatHistory: ChatMessage[];
  apiKey: string;
  error: Error | null;
};

export type SetChatStore = (
  key: keyof ChatStore,
  value: ChatStore[keyof ChatStore],
) => void;
