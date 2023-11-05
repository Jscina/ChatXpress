const ChatInput = () => {
  return (
    <>
      <div class="fixed bottom-8 left-0 right-4 flex flex-col max-w-2xl w-auto mx-auto py-2 px-4 border rounded-xl shadow-md transition-all duration-300 ease-in-out border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg z-50">
        <form class="m-0 w-full flex flex-col gap-2">
          <div class="flex items-center">
            <textarea
              rows="1"
              class="resize-none border-0 p-2 pr-10 focus:border-none focus:ring-0 focus:outline-none md:pr-12 pl-3 md:pl-0 w-full overflow-y-auto max-h-full dark:bg-neutral-600 dark:text-white"
              placeholder="Send a message"
              required></textarea>
            <button class="w-10 h-10 p-2 rounded-md bg-green-500 text-white flex items-center justify-center">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatInput;
