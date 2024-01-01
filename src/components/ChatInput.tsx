import { createSignal, createEffect } from "solid-js";

interface ChatInputProps {
  setMessage: (message: string) => void;
}

const ChatInput = ({ setMessage }: ChatInputProps) => {
  const [messageRef, setMessageRef] = createSignal<HTMLTextAreaElement>();
  const [messageInput, setMessageInput] = createSignal("");

  const sendMessage = (e: Event) => {
    e.preventDefault();

    const promptInput = messageInput();
    const textArea = messageRef();

    if (textArea) textArea.value = "";
    if (promptInput !== "") setMessage(promptInput);
  };

  const handleInput = (e: any) => {
    setMessageInput(e.currentTarget.value);

    const scrollHeight = e.target.scrollHeight;
    if (messageInput()) {
      messageRef()?.style.setProperty("height", scrollHeight + "px");
    } else {
      messageRef()?.style.setProperty("height", "auto");
    }
  };

  createEffect(async () => {});

  return (
    <div class="flex flex-col mb-4 items-center max-w-[50%] w-full min-w-min py-2 px-4 border rounded-xl shadow-md border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg transition-all duration-300 ease-in-out">
      <form class="m-0 w-full flex flex-col gap-2" onSubmit={sendMessage}>
        <div class="flex items-center space-x-2">
          <textarea
            ref={setMessageRef}
            onInput={handleInput}
            rows="1"
            class="resize-none border-0 p-2 overflow-y-auto max-h-40 dark:bg-neutral-600 dark:text-white bg-transparent flex-grow outline-none"
            placeholder="Send a message..."
            required
          ></textarea>
          <button
            type="submit"
            class="w-10 h-10 p-2 rounded-md bg-green-500 text-white flex items-center justify-center"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
