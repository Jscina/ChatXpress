import { createSignal } from "solid-js";
// import { invoke } from "@tauri-apps/api/tauri";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatInput from "./components/ChatInput";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        class={`w-full h-screen bg-light dark:bg-dark text-primary-dark dark:text-primary-light flex-grow overflow-hidden relative transition-transform ease-in-out duration-300 ${
          isSidebarOpen() ? "translate-x-w-54 bg-sidebar" : "translate-x-0"
        }`}>
        <div class="flex flex-col w-full p-8 mt-16 h-full">
          <div class="flex flex-row justify-center">
            <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex justify-center grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45 w-4/5">
              <div class="flex flex-col w-1/2 self-center border-none rounded-lg"></div>
            </div>
            <div class="flex-shrink-0 w-16"></div>
          </div>
          <ChatInput />
        </div>
      </main>
    </>
  );
};

export default App;
