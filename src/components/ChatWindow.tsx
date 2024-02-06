import { createSignal, createEffect, Index, Show } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import Spinner from "./Spinner";
import { getHistory, getModelPricing, countTokens } from "../api/assistant";
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
  const [chatCost, setChatCost] = createSignal<number>(0);

  const calculateTokens = async (
    history: ChatMessage[],
  ): Promise<ChatMessage[]> => {
    setChatCost(0);
    for (let i = 0; i < history.length; i++) {
      if (history[i].tokens !== undefined) continue;
      history[i].tokens = await countTokens(history[i].content);
    }
    return history;
  };

  const calculateCost = async (history: ChatMessage[]) => {
    const assistant = activeAssistant();
    if (assistant === undefined) return;
    const model = assistant.model;
    const pricing = await getModelPricing();
    if (!pricing) return;
    const cost = pricing[model];
    let inputCost = 0;
    let outputCost = 0;
    history.forEach((message) => {
      switch (message.role) {
        case AIRole.USER:
          console.log(message.tokens);
          if (message.tokens === undefined) return;
          inputCost += (message.tokens / 1000) * cost.input;
          break;
        case AIRole.ASSISTANT:
          console.log(message.tokens);
          if (message.tokens === undefined) return;
          outputCost += (message.tokens / 1000) * cost.output;
          break;
      }
    });
    const total = inputCost + outputCost;
    setChatCost(total);
    setChatHistory(history);
  };

  createEffect(async () => {
    const currentHistory = chatHistory() ?? [];
    const userMessage = currentMessage();
    const assistantMessage = assistantResponse();
    if (userMessage !== "" && !assistantLoading()) {
      setChatHistory([
        ...currentHistory,
        {
          role: AIRole.USER,
          content: userMessage,
        },
      ]);

      setAssistantLoading(true);
      setCurrentMessage("");
    } else if (assistantMessage !== "" && assistantLoading()) {
      setChatHistory([
        ...currentHistory,
        {
          role: AIRole.ASSISTANT,
          content: assistantMessage,
        },
      ]);

      setAssistantLoading(false);
      setAssistantResponse("");
    }
    if (currentHistory !== chatHistory()) {
      let history = chatHistory();
      history = await calculateTokens(history ?? []);
      await calculateCost(history);
    }
  });

  // Fetch chat history for active thread
  createEffect(async () => {
    const thread = activeThread();
    if (thread === undefined) return null;
    let history = await getHistory(thread);
    history = history.reverse();
    setChatHistory(history);
    history = await calculateTokens(history);
    await calculateCost(history);
  });

  return (
    <>
      <Show when={chatCost() > 0}>
        <div class="flex justify-end p-4">
          <p class="border-solid border-2 border-green-300 bg-green-100 p-4 rounded dark:text-black">
            Chat Cost: ${chatCost()}
          </p>
        </div>
      </Show>
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
                        return (
                          <UserMessage
                            message={entry().content}
                            tokens={entry().tokens}
                          />
                        );
                      case AIRole.ASSISTANT:
                        return (
                          <AssistantMessage
                            message={entry().content}
                            tokens={entry().tokens}
                          />
                        );
                    }
                  }}
                </Index>
                <Show when={assistantLoading()}>
                  <div class="flex justify-center p-4">
                    <div class="flex justify-center items-center">
                      <Spinner />
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
