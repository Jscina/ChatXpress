import { onMount, createEffect, createSignal, For } from "solid-js";
import clsx from "clsx";
import UserProfile from "./UserProfile";
import HistoryItem from "./HistoryItem";
import { Button } from "./ui/button";
import type { Thread, ChatMessage } from "../types";
import { listThreads } from "../api/database";

interface SidebarProps {
  setSidebarOpen: (val: boolean) => void;
  isSidebarOpen: () => boolean;
  activeThread: () => Thread | undefined;
  setActiveThread: (val: Thread | undefined) => void;
  chatHistory: () => ChatMessage[];
  setChatHistory: (val: ChatMessage[]) => void;
  setApiKey: (val: string) => void;
  apiKey: () => string;
}

const Sidebar = ({
  setSidebarOpen,
  isSidebarOpen,
  activeThread,
  setActiveThread,
  chatHistory,
  setChatHistory,
  setApiKey,
  apiKey,
}: SidebarProps) => {
  const [history, setHistory] = createSignal<Thread[] | null>(null);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen());
  };

  const handleNewChat = () => {
    setActiveThread(undefined);
    setChatHistory([]);
  };

  createEffect(async () => {
    if (!activeThread() || chatHistory().length > 0) {
      const threads = await listThreads();
      setHistory(threads);
    }
  });

  onMount(async () => {
    const threads = await listThreads();
    setHistory(threads);
  });

  return (
    <>
      <nav
        class={clsx(
          "fixed top-0 left-0 w-56 transition-transform ease-in-out transform duration-300 shadow-lg max-h-screen overflow-y-hidden bg-sidebar text-white flex flex-col h-full",
          {
            "translate-x-0": isSidebarOpen(),
            "-translate-x-full": !isSidebarOpen(),
          },
        )}
      >
        <div class="flex-none">
          <div class="flex flex-row mt-3 justify-center gap-5">
            <Button
              onClick={handleNewChat}
              class="flex items-center self-center rounded text-white hover:bg-gray-600 dark:hover:bg-gray-700 p-4 mb-3 bg-transparent"
            >
              <i class="fa-solid fa-plus mr-1"></i>
              <p>New Chat</p>
            </Button>
            <Button
              onClick={toggleSidebar}
              class="flex items-center self-center rounded text-white hover:bg-gray-600 dark:hover:bg-gray-700 p-4 mb-3 bg-transparent"
            >
              <i class="fa-solid fa-x"></i>
            </Button>
          </div>
          <hr />
        </div>
        <div class="flex flex-col space-y-2 p-4 overflow-y-auto flex-grow">
          <For each={history()}>
            {(message, _) => {
              if (message) {
                return (
                  <HistoryItem
                    thread={message}
                    activeThread={activeThread}
                    setChatHistory={setChatHistory}
                    setHistory={setHistory}
                    setActiveThread={setActiveThread}
                  />
                );
              }
            }}
          </For>
        </div>
        <div class="flex-none">
          <hr />
          <div class="flex flex-col space-y-2 p-4 mb-auto">
            <UserProfile apiKey={apiKey} setApiKey={setApiKey} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
