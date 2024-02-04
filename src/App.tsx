import { createSignal, onMount, Show } from "solid-js";
import clsx from "clsx";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { readApiKey, setOpenAIApiKey, getModelPricing } from "./api/assistant";
import type { Assistant, Thread, ChatMessage } from "./types";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal<boolean>(false);
  const [assistantResponse, setAssistantResponse] = createSignal<string>("");
  const [currentMessage, setCurrentMessage] = createSignal<string>("");
  const [activeAssistant, setActiveAssistant] = createSignal<Assistant>();
  const [activeThread, setActiveThread] = createSignal<Thread>();
  const [chatHistory, setChatHistory] = createSignal<ChatMessage[] | null>(
    null,
  );
  const [apiKey, setApiKey] = createSignal<string>("");

  onMount(async () => {
    console.log(await getModelPricing());
    try {
      setApiKey(await readApiKey());
      await setOpenAIApiKey();
    } catch (e) {
      setApiKey("");
      console.error(e);
    }
  });

  return (
    <>
      <Header
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveAssistant={setActiveAssistant}
        apiKey={apiKey}
      />
      <Sidebar
        activeThread={activeThread}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveThread={setActiveThread}
        setChatHistory={setChatHistory}
        apiKey={apiKey}
        setApiKey={setApiKey}
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
          <ChatWindow
            activeAssistant={activeAssistant}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            assistantResponse={assistantResponse}
            setAssistantResponse={setAssistantResponse}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            activeThread={activeThread}
          />
          <ChatInput
            setCurrentMessage={setCurrentMessage}
            activeAssistant={activeAssistant}
            setAssistantResponse={setAssistantResponse}
            setActiveThread={setActiveThread}
            activeThread={activeThread}
          />
        </div>
        <Show when={!apiKey()}>
          <div class="fixed inset-0 flex  items-center justify-center z-50">
            <Alert class="max-w-[50%]">
              <AlertTitle class="text-2xl">API Key Required</AlertTitle>
              <AlertDescription>
                Please enter your API key in the settings menu to continue.
              </AlertDescription>
            </Alert>
          </div>
        </Show>
      </main>
    </>
  );
};

export default App;
