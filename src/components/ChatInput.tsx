import { createSignal, createEffect, Show } from "solid-js";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { conversation } from "../api/assistant";
import { createThread } from "../api/database";

import clsx from "clsx";
import {
  AIRole,
  type ChatStore,
  type SetChatStore,
  type Assistant,
  type Thread,
} from "../types";

interface ChatInputProps {
  chatStore: ChatStore;
  setChatStore: SetChatStore;
}

const ChatInput = ({ chatStore, setChatStore }: ChatInputProps) => {
  const [messageRef, setMessageRef] = createSignal<HTMLTextAreaElement>();
  const [messageInput, setMessageInput] = createSignal("");
  const [disabled, isDisabled] = createSignal<boolean>(false);

  const handleAssistantResponse = async (
    message: string,
    assistant: Assistant | null,
    thread: Thread | null,
  ) => {
    if (!assistant) return;

    const response = await conversation(message, assistant, thread);
    setChatStore("assistantResponse", response.content);

    if (chatStore.activeThread?.id === response.thread.id) {
      return;
    } else if (chatStore.activeThread === null) {
      await createThread(response.thread);
      setChatStore("activeThread", response.thread);
    }
  };

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

    await handleAssistantResponse(promptInput, assistant, thread);
  };

  const regenResponse = async () => {
    const history = chatStore.chatHistory.slice().reverse();
    const activeAssistant = chatStore.activeAssistant;
    const activeThread = chatStore.activeThread;
    if (activeAssistant === null) return;
    const i = history.findIndex(
      (msg) => msg.role.toLowerCase() === AIRole.USER,
    );

    if (i === -1) return;

    const msg = history[i].content;
    console.log(msg);

    setChatStore("currentMessage", msg);
    setChatStore(
      "chatHistory",
      history.reverse().slice(0, history.length - i - 1),
    );
    await handleAssistantResponse(
      history[i].content,
      activeAssistant,
      activeThread,
    );
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
    <>
      <Show when={chatStore.chatHistory.length > 0}>
        <Button
          type="button"
          class="mb-2 bg-transparent hover:bg-neutral-600 border-solid border dark:border-neutral-600 shadow-md border-neutral-300"
          onClick={regenResponse}
        >
          <p class="mr-1">Regenerate</p>
          <i class="fa-regular fa-rotate-right"></i>
        </Button>
      </Show>
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
    </>
  );
};

export default ChatInput;
