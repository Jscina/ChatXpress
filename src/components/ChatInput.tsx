interface ChatInputProps {
  isSidebarOpen: () => boolean;
}

const ChatInput = ({ isSidebarOpen }: ChatInputProps) => {
  return (
    <div
      class={`flex flex-col items-center max-w-[50%] w-full py-2 px-4 border rounded-xl shadow-md border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen() ? "mr-56" : "ml-0"
      }`}>
      <form class="m-0 w-full flex flex-col gap-2">
        <div class="flex items-center space-x-2">
          <textarea
            rows="1"
            class="resize-none border-0 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none overflow-y-auto max-h-full dark:bg-neutral-600 dark:text-white flex-grow"
            placeholder="Send a message"
            required></textarea>
          <button class="w-10 h-10 p-2 rounded-md bg-green-500 text-white flex items-center justify-center">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
