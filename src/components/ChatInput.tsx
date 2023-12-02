import { createSignal, createEffect } from "solid-js";

const ChatInput = () => {
  const [messageRef, setMessageRef] = createSignal<HTMLTextAreaElement>();
  const [userMessage, setUserMessage] = createSignal<string>("");

  const sendMessage = (e: Event) => {
    e.preventDefault();
    const promptInput = messageRef();

    if (promptInput && promptInput.value !== "") {
      setUserMessage(promptInput.value);
      promptInput.value = "";
    }
  };

  createEffect(async () => {
    if (userMessage() !== "") {
    }
  });

  return (
    <div class="flex flex-col items-center max-w-[50%] w-full py-2 px-4 border rounded-xl shadow-md border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg transition-all duration-300 ease-in-out">
      <form class="m-0 w-full flex flex-col gap-2" onSubmit={sendMessage}>
        <div class="flex items-center space-x-2">
          <textarea
            ref={setMessageRef}
            rows="1"
            class="resize-none border-0 p-2 overflow-y-auto max-h-full dark:bg-neutral-600 dark:text-white bg-transparent flex-grow outline-none"
            placeholder="Send a message..."
            required></textarea>
          <button
            type="submit"
            class="w-10 h-10 p-2 rounded-md bg-green-500 text-white flex items-center justify-center">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
