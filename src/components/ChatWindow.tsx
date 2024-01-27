import { onMount, createEffect, Index } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { AIRole, type ChatMessage } from "../types";

interface ChatWindowProps {
  currentMessage: () => string;
  setCurrentMessage: (val: string) => void;
  assistantResponse: () => string;
  setAssistantResponse: (val: string) => void;
  chatHistory: () => ChatMessage[] | null;
  setChatHistory: (val: ChatMessage[] | null) => void;
}

const ChatWindow = ({
  currentMessage,
  setCurrentMessage,
  assistantResponse,
  setAssistantResponse,
  chatHistory,
  setChatHistory,
}: ChatWindowProps) => {
  createEffect(() => {
    const currentHistory = chatHistory() ?? [];
    if (currentMessage() !== "") {
      setChatHistory([
        ...currentHistory,
        {
          role: AIRole.USER,
          content: currentMessage(),
        },
      ]);
      setCurrentMessage("");
    } else if (assistantResponse() !== "") {
      setChatHistory([
        ...currentHistory,
        {
          role: AIRole.ASSISTANT,
          content: assistantResponse(),
        },
      ]);
      setAssistantResponse("");
    }
  });

  onMount(() => {
    setChatHistory(null);
  });

  return (
    <>
      <div class="flex-grow overflow-auto max-h-[calc(100vh-14rem)] w-full h-full">
        <div class="flex">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex-grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45">
            <div class="flex flex-col justify-center self-center border-none rounded-lg">
              <Index each={chatHistory()}>
                {(entry) => {
                  switch (entry().role) {
                    case AIRole.USER:
                      return <UserMessage message={entry().content} />;
                    case AIRole.ASSISTANT:
                      return <AssistantMessage message={entry().content} />;
                  }
                }}
              </Index>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
