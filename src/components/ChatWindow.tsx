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
  type Assistant,
  type ChatStore,
  type SetChatStore,
} from "../types";

interface ErrorMessageProps {
  activeAssistant: Assistant | null;
}

const ErrorMessage = ({ activeAssistant }: ErrorMessageProps) => {
  return (
    <Show when={activeAssistant === undefined}>
      <div class="flex justify-center p-4">
        <p class="border-solid border-2 border-yellow-300 bg-yellow-100 p-4 rounded dark:text-black">
          Chat will be disbaled until an assistant is selected.
        </p>
      </div>
    </Show>
  );
};

interface ChatWindowProps {
  chatStore: ChatStore;
  setChatStore: SetChatStore;
}

const ChatWindow = ({ chatStore, setChatStore }: ChatWindowProps) => {
  const [assistantLoading, setAssistantLoading] = createSignal<boolean>(false);
  const [chatCost, setChatCost] = createSignal<number>(0);

  const calculateCost = async (tokens: [number, number]) => {
    const assistant = chatStore.activeAssistant;
    if (assistant === null) return;
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
    const currentHistory = chatStore.chatHistory;
    const lastRole =
      currentHistory.length > 0
        ? currentHistory[currentHistory.length - 1].role
        : null;

    const addMessageToHistory = () => {
      let newHistory = [...currentHistory];
      newHistory.push({
        role: role,
        content: message,
      });

      setChatStore("chatHistory", newHistory);
    };

    if (message !== "" && lastRole !== role) {
      addMessageToHistory();
    } else if (message !== "" && lastRole === null) {
      addMessageToHistory();
    }
  };

  createEffect(async () => {
    if (!assistantLoading() && chatStore.currentMessage !== "") {
      await addMessageToHistory(AIRole.USER, chatStore.currentMessage);
      setAssistantLoading(true);
      setChatStore("currentMessage", "");
    }
  });

  createEffect(async () => {
    if (assistantLoading() && chatStore.assistantResponse !== "") {
      await addMessageToHistory(AIRole.ASSISTANT, chatStore.assistantResponse);
      setAssistantLoading(false);
      setChatStore("assistantResponse", "");
    }
  });

  createEffect(async () => {
    const currentHistory = chatStore.chatHistory;
    const history = await countTokens(currentHistory);

    if (currentHistory.length > 1) {
      if (JSON.stringify(history) !== JSON.stringify(currentHistory)) {
        setChatStore("chatHistory", history);
      }
      const tokens = await countAllTokens(history);
      await calculateCost(tokens);
    }
  });

  createEffect(async () => {
    try {
      const thread = chatStore.activeThread;
      if (thread === null) return null;
      let history = await getHistory(thread);
      history = history.reverse();
      setChatStore("chatHistory", history);
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <>
      <Show
        when={
          chatCost() > 0 &&
          chatStore.activeThread &&
          chatStore.chatHistory.length > 0
        }
      >
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
                when={chatStore.activeAssistant !== null}
                fallback={
                  <ErrorMessage activeAssistant={chatStore.activeAssistant} />
                }
              >
                <Index each={chatStore.chatHistory}>
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
