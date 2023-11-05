export enum AIRole {
  SYSTEM = "system",
  USER = "user",
  ASSISSTANT = "assistant",
  FUNCTION = "function",
}

export type ChatMessage = {
  role: AIRole;
  content: string;
};
