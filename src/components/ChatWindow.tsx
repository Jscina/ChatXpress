import { createSignal, createEffect, Index, Show } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { getHistory } from "../api/assistant";
import {
  AIRole,
  type ChatMessage,
  type Assistant,
  type Thread,
} from "../types";

interface ErrorMessageProps {
  activeAssistant: () => Assistant | undefined;
}

const ErrorMessage = ({ activeAssistant }: ErrorMessageProps) => {
  return (
    <Show when={activeAssistant() === undefined}>
      <div class="flex justify-center p-4">
        <p class="border-solid border-2 border-yellow-300 bg-yellow-100 p-4 rounded dark:text-black">
          Chat will be disbaled until an assistant is selected.
        </p>
      </div>
    </Show>
  );
};

interface ChatWindowProps {
  activeAssistant: () => Assistant | undefined;
  currentMessage: () => string;
  setCurrentMessage: (val: string) => void;
  assistantResponse: () => string;
  setAssistantResponse: (val: string) => void;
  chatHistory: () => ChatMessage[] | null;
  setChatHistory: (val: ChatMessage[] | null) => void;
  activeThread: () => Thread | undefined;
}

const ChatWindow = ({
  activeAssistant,
  currentMessage,
  setCurrentMessage,
  assistantResponse,
  setAssistantResponse,
  chatHistory,
  setChatHistory,
  activeThread,
}: ChatWindowProps) => {
  const [assistantLoading, setAssistantLoading] = createSignal<boolean>(false);

  createEffect(() => {
    const currentHistory = chatHistory() ?? [];
    if (currentMessage() !== "" && !assistantLoading()) {
      setChatHistory([
        ...currentHistory,
        {
          role: AIRole.USER,
          content: currentMessage(),
        },
      ]);
      setAssistantLoading(true);
      setCurrentMessage("");
    } else if (assistantResponse() !== "" && assistantLoading()) {
      setChatHistory([
        ...currentHistory,
        {
          role: AIRole.ASSISTANT,
          content: assistantResponse(),
        },
      ]);
      setAssistantLoading(false);
      setAssistantResponse("");
    }
  });

  // Fetch chat history for active thread
  createEffect(async () => {
    const thread = activeThread();
    if (thread === undefined) return null;
    const history = await getHistory(thread);
    setChatHistory(history.reverse());
  });

  return (
    <>
      <div class="flex-grow overflow-auto max-h-[calc(100vh-14rem)] w-full h-full">
        <div class="flex">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex-grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45">
            <div class="flex flex-col justify-center self-center border-none rounded-lg">
              <Show
                when={activeAssistant() !== undefined}
                fallback={<ErrorMessage activeAssistant={activeAssistant} />}
              >
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
                <Show when={assistantLoading()}>
                  <div class="flex justify-center p-4">
                    <div class="flex justify-center items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  </div>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
