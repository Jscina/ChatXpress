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
        content: "Hello"

      },
      {
        role: AIRole.ASSISTANT,
        content: "Hi, I am doing well. How are you? I am here to listen :)",
      },
      {
        role: AIRole.USER,
        content: "Thanks, what is the meaning of life?"
      },
    ]);
  });

  return (
    <>
      <div class="flex-grow overflow-auto max-h-[calc(100vh-14rem)] w-full h-full">
        <div class="flex">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex-grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45">
            <div class="flex flex-col justify-center self-center border-none rounded-lg">
              <For each={history()}>
                {(message) => {
                  switch (message.role) {
                    case AIRole.USER:
                      return <UserMessage message={message.content} />;
                    case AIRole.ASSISTANT:
                      return <AssistantMessage message={message.content} />;
                  }
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
