import { createSignal } from "solid-js";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal<boolean>(false);

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
          <ChatWindow />
          <ChatInput isSidebarOpen={isSidebarOpen} />
        </div>
      </main>
    </>
  );
};

export default App;
