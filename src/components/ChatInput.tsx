import { createSignal, createEffect } from "solid-js";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { conversation } from "../api/assistant";
import { createThread } from "../api/database";

import clsx from "clsx";
import type { ChatStore, SetChatStore } from "../types";

interface ChatInputProps {
  chatStore: ChatStore;
  setChatStore: SetChatStore;
}

const ChatInput = ({ chatStore, setChatStore }: ChatInputProps) => {
  const [messageRef, setMessageRef] = createSignal<HTMLTextAreaElement>();
  const [messageInput, setMessageInput] = createSignal("");
  const [disabled, isDisabled] = createSignal<boolean>(false);

  const sendMessage = async (e: Event) => {
    e.preventDefault();

    const promptInput = messageInput();
    const textArea = messageRef();

    if (textArea) {
      textArea.value = "";
      setMessageInput("");
    }
    if (promptInput !== "") setChatStore("currentMessage", promptInput);

    const assistant = chatStore.activeAssistant;
    const thread = chatStore.activeThread;
    if (!assistant) return;

    const response = await conversation(promptInput, assistant, thread);
    setChatStore("assistantResponse", response.content);

    if (chatStore.activeThread?.id === response.thread.id) {
      return;
    } else if (chatStore.activeThread === null) {
      await createThread(response.thread);
      setChatStore("activeThread", response.thread);
    }
  };

  const setContainerHeight = (height: string) => {
    messageRef()?.style.setProperty("height", height);
  };

  const handleInput = (e: any) => {
    setMessageInput(e.currentTarget.value);

    const scrollHeight = e.target.scrollHeight;
    if (messageInput() !== "") {
      setContainerHeight(scrollHeight + "px");
    }
  };

  createEffect(() => {
    if (messageInput() === "") {
      setContainerHeight("auto");
    }
  });

  createEffect(() => {
    if (chatStore.activeAssistant === null) {
      isDisabled(true);
    } else {
      isDisabled(false);
    }
  });

  return (
    <div class="flex flex-col mb-12 items-center max-w-[50%] w-full min-w-min py-2 px-4 border rounded-xl shadow-md border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg transition-all duration-300 ease-in-out">
      <form class="m-0 w-full flex flex-col gap-2" onSubmit={sendMessage}>
        <div class="flex items-center space-x-2">
          <Textarea
            ref={setMessageRef}
            onInput={handleInput}
            rows="1"
            class="resize-none border-0 p-2 overflow-y-auto min-h-4 max-h-40 dark:bg-neutral-600 dark:text-white bg-transparent flex-grow outline-none"
            style="outline: none !important; box-shadow: none !important;"
            placeholder="Send a message..."
            required
          ></Textarea>
          <Button
            type="submit"
            disabled={disabled()}
            class={clsx(
              "w-10 h-10 p-2 rounded-md bg-green-500 hover:bg-green-400 text-white flex items-center justify-center",
              {
                "disabled:opacity-50 disabled:pointer-events-none":
                  chatStore.activeAssistant === null,
              },
            )}
          >
            <i class="fa-solid fa-paper-plane"></i>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
