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
  id?: number;
  assistant_id?: string;
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
