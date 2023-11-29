import UserProfile from "./UserProfile";
import { onMount, createSignal, For } from "solid-js";

interface HistoryItemProps {
  name: string;
}

const HistoryItem = ({ name }: HistoryItemProps) => {
  return <div class="flex flex-row justify-between">{name}</div>;
};

interface SidebarProps {
  setSidebarOpen: (val: boolean) => void;
  isSidebarOpen: () => boolean;
}

const Sidebar = ({ setSidebarOpen, isSidebarOpen }: SidebarProps) => {
  const [history, setHistory] = createSignal<string[] | null>(null);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen());
  };

  onMount(async () => {
    setHistory(["Hello", "Hi", "How are you?"]);
  });

  return (
    <>
      <nav
        class={`fixed top-0 left-0 w-56 transition-transform ease-in-out transform duration-300 ${
          isSidebarOpen() ? "translate-x-0" : "-translate-x-full"
        } shadow-lg max-h-screen overflow-y-hidden bg-sidebar text-white flex flex-col h-full`}>
        <div class="flex-none">
          <div class="flex flex-row mt-3 justify-center">
            <button class="flex items-center self-center rounded text-white hover:bg-gray-600 dark:hover:bg-gray-700 p-3 mb-3">
              <i class="fa-solid fa-plus mr-1"></i>
              <p>New Chat</p>
            </button>
            <button
              class="flex items-center self-center rounded text-white hover:bg-gray-600 dark:hover:bg-gray-700 p-3 mb-3"
              onClick={toggleSidebar}>
              <i class="fa-solid fa-x"></i>
            </button>
          </div>
          <hr />
        </div>
        <div class="flex flex-col space-y-2 p-4 overflow-y-auto flex-grow">
          <For each={history()}>
            {(message, _) => {
              if (message) {
                return <HistoryItem name={message} />;
              }
            }}
          </For>
        </div>
        <div class="flex-none">
          <hr />
          <div class="flex flex-col space-y-2 p-4 mb-auto">
            <UserProfile />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
