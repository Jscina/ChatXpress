import { createSignal, onMount, For } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { AIRole, type ChatMessage } from "../types";

const ChatWindow = () => {
  const [history, setHistory] = createSignal<ChatMessage[] | null>(null);

  onMount(async () => {
    setHistory([
      {
        role: AIRole.USER,
        content: "Hello",
      },
      {
        role: AIRole.ASSISTANT,
        content: "Hi",
      },
      {
        role: AIRole.USER,
        content: "How are you?",
      },
    ]);
  });

  return (
    <>
      <div class="flex-grow justify-center overflow-auto max-h-[calc(100vh-14rem)]">
        <div class="flex items-center justify-center">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex justify-center grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45 w-4/5">
            <div class="flex flex-col w-1/2 self-center border-none rounded-lg">
              <For each={history()}>
                {(message) => {
                  switch (message.role) {
                    case "user":
                      return <UserMessage message={message.content} />;
                    case "assistant":
                      return <AssistantMessage message={message.content} />;
                  }
                }}
              </For>
            </div>
          </div>
          <div class="flex-shrink-0 w-16"></div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
