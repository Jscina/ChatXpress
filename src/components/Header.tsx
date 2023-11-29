interface HeaderProps {
  setSidebarOpen: (val: boolean) => void;
  isSidebarOpen: () => boolean;
}

const Header = ({ setSidebarOpen, isSidebarOpen }: HeaderProps) => {
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen());
  };
  return (
    <>
      <header
        class={`fixed w-full top-0 left-0 h-16 z-10 bg-header text-white p-4 shadow-md flex items-center transition-transform ease-in-out duration-300 ${
          isSidebarOpen() ? "translate-x-w-54" : "translate-x-0"
        }`}>
        <button
          class={`relative focus:outline-none p-2 ${
            isSidebarOpen() ? "hidden" : "block"
          }`}
          onClick={toggleSidebar}>
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="transform transition-transform ease-in-out duration-300">
          <h1 class="text-2xl font-semibold">ChatXPress</h1>
        </div>
      </header>
    </>
  );
};

export default Header;
