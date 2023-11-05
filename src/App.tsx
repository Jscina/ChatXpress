import { createSignal, onMount } from "solid-js";
// import { invoke } from "@tauri-apps/api/tauri";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = createSignal(false);

  onMount(() => {
    document.body.classList.add("dark");
  });

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        class={`w-full h-screen bg-light dark:bg-dark text-primary-dark dark:text-primary-light flex-grow overflow-hidden relative transition-transform ease-in-out duration-300 ${
          isSidebarOpen() ? "translate-x-w-54 bg-sidebar" : "translate-x-0"
        }`}></main>
    </>
  );
};

export default App;
