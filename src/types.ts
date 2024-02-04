export enum AIRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  FUNCTION = "function",
}

export type ChatMessage = {
  role: AIRole;
  content: string;
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

export type ModelPricing = {
  model: {
    input: number;
    output: number;
  };
};
