import { createSignal, createEffect } from "solid-js";
import { AIRole } from "../types";
import type { ChatMessage } from "../types";

interface ChatInputProps {
  isSidebarOpen: () => boolean;
  message: () => ChatMessage[];
  setMessage: (val: ChatMessage[]) => void;
}

const ChatInput = ({ isSidebarOpen, message, setMessage }: ChatInputProps) => {
  const [messageRef, setMessageRef] = createSignal<HTMLTextAreaElement>();

  const sendMessage = (e: Event) => {
    e.preventDefault();
    const promptInput = messageRef();

    if (promptInput && promptInput.value !== "") {
      let messages = message();
      messages?.push({ role: AIRole.USER, content: promptInput.value });
      setMessage(messages);
      promptInput.value = "";
    }
  };

  createEffect(() => {
    if (message()) {
      console.log(message());
    }
  });

  return (
    <div
      class={`flex flex-col items-center max-w-[50%] w-full py-2 px-4 border rounded-xl shadow-md border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen() ? "mr-56" : "ml-0"
      }`}>
      <form class="m-0 w-full flex flex-col gap-2" onSubmit={sendMessage}>
        <div class="flex items-center space-x-2">
          <textarea
            ref={setMessageRef}
            rows="1"
            class="resize-none border-0 p-2 overflow-y-auto max-h-full dark:bg-neutral-600 dark:text-white flex-grow"
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
