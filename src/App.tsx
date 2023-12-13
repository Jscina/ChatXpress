import { createSignal } from "solid-js";
import "highlight.js/styles/github.css";
import clsx from "clsx";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal<string>("");

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
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
          <ChatWindow message={message} setMessage={setMessage} />
          <ChatInput message={message} setMessage={setMessage} />
        </div>
      </main>
    </>
  );
};

export default App;
