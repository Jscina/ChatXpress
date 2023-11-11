import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import { AIRole, type ChatMessage } from "./types";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal<boolean>(false);
  // The system message will be gotten from the backend on mount.
  const [message, setMessage] = createSignal<ChatMessage[]>([
    { role: AIRole.SYSTEM, content: "Hello, I'm the AI." },
  ]);

  const get_history = async () => {
    await invoke("get_history", { thread_id: null });
  };

  onMount(async () => {
    await get_history();
  });

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        class={`w-full h-screen bg-light dark:bg-dark text-primary-dark dark:text-primary-light flex-grow overflow-hidden relative transition-transform ease-in-out duration-300 ${
          isSidebarOpen()
            ? "translate-x-w-54 bg-sidebar max-w-full"
            : "translate-x-0"
        }`}>
        <div class="flex flex-col p-8 mt-16 h-screen justify-center items-center">
          <ChatWindow message={message} />
          <ChatInput
            isSidebarOpen={isSidebarOpen}
            message={message}
            setMessage={setMessage}
          />
        </div>
      </main>
    </>
  );
};

export default App;
