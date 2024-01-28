import { createSignal } from "solid-js";
import "highlight.js/styles/github.css";
import clsx from "clsx";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
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
  return (
    <>
      <Header
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveAssistant={setActiveAssistant}
      />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeThread={activeThread}
        setActiveThread={setActiveThread}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
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
      </main>
    </>
  );
};

export default App;
