import { createSignal, createEffect } from "solid-js";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { conversation } from "../api/assistant";
import { createThread } from "../api/database";

import clsx from "clsx";
import type { Assistant, Thread } from "../types";

interface ChatInputProps {
  setCurrentMessage: (message: string) => void;
  activeAssistant: () => Assistant | undefined;
  setAssistantResponse: (val: string) => void;
  setActiveThread: (val: Thread) => void;
  activeThread: () => Thread | undefined;
}

const ChatInput = ({
  setCurrentMessage,
  activeAssistant,
  setAssistantResponse,
  setActiveThread,
  activeThread,
}: ChatInputProps) => {
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
    if (promptInput !== "") setCurrentMessage(promptInput);

    const assistant = activeAssistant();
    const thread = activeThread();
    if (!assistant) return;

    const response = await conversation(promptInput, assistant, thread);
    setAssistantResponse(response.content);

    if (activeThread()?.id === response.thread.id) {
      return;
    } else if (activeThread() === undefined) {
      await createThread(response.thread);
      setActiveThread(response.thread);
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
    if (activeAssistant() === undefined) {
      isDisabled(true);
    } else {
      isDisabled(false);
    }
  });

  return (
    <div class="flex flex-col mb-4 items-center max-w-[50%] w-full min-w-min py-2 px-4 border rounded-xl shadow-md border-neutral-300  dark:bg-neutral-600 dark:border-neutral-800 dark:shadow-lg transition-all duration-300 ease-in-out">
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
                  activeAssistant() === undefined,
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
