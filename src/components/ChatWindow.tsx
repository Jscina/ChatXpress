import { createSignal, onMount } from "solid-js";
import { getHistory } from "../api";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import type { ChatMessage } from "../types";

const ChatWindow = () => {
  const [history, setHistory] = createSignal<ChatMessage[] | null>(null);

  onMount(async () => {
    setHistory(await getHistory({ id: "tmp" }));
  });

  return (
    <>
      <div class="flex-grow justify-center overflow-auto max-h-[calc(100vh-14rem)]">
        <div class="flex items-center justify-center">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex justify-center grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45 w-4/5">
            <div class="flex flex-col w-1/2 self-center border-none rounded-lg">
              {history() &&
                history()?.map((message) => {
                  switch (message.role) {
                    case "user":
                      return <UserMessage message={message.content} />;
                    case "assistant":
                      return <AssistantMessage message={message.content} />;
                  }
                })}
            </div>
          </div>
          <div class="flex-shrink-0 w-16"></div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
