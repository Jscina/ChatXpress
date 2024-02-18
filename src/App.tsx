import { createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import clsx from "clsx";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { readApiKey, setOpenAIApiKey } from "./api/assistant";
import type { Assistant, Thread, ChatMessage, Error } from "./types";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal<boolean>(false);
  const [chatStore, setChatStore] = createStore({
    assistantResponse: "" as string,
    currentMessage: "" as string,
    activeAssistant: null as Assistant | null,
    activeThread: null as Thread | null,
    chatHistory: [] as ChatMessage[],
    apiKey: "" as string,
    error: null as Error | null,
  });

  onMount(async () => {
    try {
      const apiKey = await readApiKey();
      setChatStore("apiKey", apiKey);
      await setOpenAIApiKey();
    } catch (e) {
      setChatStore("apiKey", "");
      setChatStore("error", {
        title: "API Key not found",
        message: "Please enter an API key in settings menu to continue",
      } as Error);
    }
  });

  return (
    <>
      <Header
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatStore={chatStore}
        setChatStore={setChatStore}
      />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatStore={chatStore}
        setChatStore={setChatStore}
      />
      <main
        class={clsx(
          "h-screen bg-light dark:bg-dark text-primary-dark dark:text-primary-light flex-grow overflow-hidden relative transition-transform ease-in-out duration-300",
          {
            "translate-x-w-54 bg-sidebar max-w-[calc(100%-14rem)]":
              isSidebarOpen(),
            "translate-x-0 max-w-full": !isSidebarOpen(),
          },
        )}
      >
        <div class="flex flex-col p-8 mt-16 bg-light dark:bg-dark h-screen justify-center items-center">
          <ChatWindow chatStore={chatStore} setChatStore={setChatStore} />
          <ChatInput chatStore={chatStore} setChatStore={setChatStore} />
        </div>
        <Show when={chatStore.error !== null}>
          <div class="fixed inset-0 flex  items-center justify-center z-50">
            <Alert class="max-w-[50%] dark:bg-dark dark:text-white">
              <AlertTitle class="text-2xl">{chatStore.error?.title}</AlertTitle>
              <AlertDescription>{chatStore.error?.message}</AlertDescription>
            </Alert>
          </div>
        </Show>
      </main>
    </>
  );
};

export default App;
