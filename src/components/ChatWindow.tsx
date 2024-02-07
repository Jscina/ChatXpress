import { createSignal, createEffect, Index, Show } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import Spinner from "./Spinner";
import {
  getHistory,
  getModelPricing,
  countTokens,
  countAllTokens,
} from "../api/assistant";
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
  chatHistory: () => ChatMessage[];
  setChatHistory: (val: ChatMessage[]) => void;
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

  const calculateCost = async (tokens: [number, number]) => {
    const assistant = activeAssistant();
    if (assistant === undefined) return;
    const model = assistant.model;
    const pricing = await getModelPricing();
    if (!pricing) return;
    const cost = pricing[model];
    const inputCost = (tokens[0] / 1000) * cost.input;
    const outputCost = (tokens[1] / 1000) * cost.output;
    const total = inputCost + outputCost;
    setChatCost(parseFloat(total.toFixed(5)));
  };

  const addMessageToHistory = async (role: AIRole, message: string) => {
    const currentHistory = chatHistory() ?? [];
    const lastRole =
      currentHistory.length > 0
        ? currentHistory[currentHistory.length - 1].role
        : null;

    if (message !== "" && lastRole !== role) {
      let newHistory = [...currentHistory];
      newHistory.push({
        role: role,
        content: message,
        tokens: await countTokens(message),
      });

      setChatHistory(newHistory);
    }
  };

  createEffect(async () => {
    if (!assistantLoading() && currentMessage() !== "") {
      await addMessageToHistory(AIRole.USER, currentMessage());
      setAssistantLoading(true);
      setCurrentMessage("");
    }
  });

  createEffect(async () => {
    if (assistantLoading() && assistantResponse() !== "") {
      await addMessageToHistory(AIRole.ASSISTANT, assistantResponse());
      setAssistantLoading(false);
      setAssistantResponse("");
    }
  });

  createEffect(async () => {
    const currentHistory = chatHistory() ?? [];
    if (currentHistory.length > 0) {
      const tokens = await countAllTokens(currentHistory);
      await calculateCost(tokens);
    }
  });

  createEffect(async () => {
    const thread = activeThread();
    if (thread === undefined) return null;
    let history = await getHistory(thread);
    history = history.reverse();
    setChatHistory(history);
    const tokens = await countAllTokens(history);
    await calculateCost(tokens);
  });

  return (
    <>
      <Show when={chatCost() > 0 && activeThread()}>
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
