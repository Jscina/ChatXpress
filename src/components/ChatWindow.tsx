import { createSignal, onMount, createEffect, Index } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { AIRole, type ChatMessage } from "../types";

interface ChatWindowProps {
  message: () => string;
  setMessage: (message: string) => void;
}

const ChatWindow = ({ message, setMessage }: ChatWindowProps) => {
  const [history, setHistory] = createSignal<ChatMessage[] | null>(null);

  createEffect(() => {
    const currentHistory = history() ?? [];
    const newMessage = message();
    const lastMessage = currentHistory[currentHistory.length - 1];
    if (
      message() !== "" &&
      (!lastMessage || newMessage !== lastMessage.content)
    ) {
      setHistory([
        ...currentHistory,
        {
          role: AIRole.USER,
          content: message(),
        },
      ]);
    }
  });

  onMount(() => {
    setHistory(null);
  });

  return (
    <>
      <div class="flex-grow overflow-auto max-h-[calc(100vh-14rem)] w-full h-full">
        <div class="flex">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex-grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45">
            <div class="flex flex-col justify-center self-center border-none rounded-lg">
              <Index each={history()}>
                {(entry) => {
                  switch (entry().role) {
                    case AIRole.USER:
                      return (
                        <UserMessage
                          message={entry().content}
                          setMessage={setMessage}
                        />
                      );
                    case AIRole.ASSISTANT:
                      return <AssistantMessage message={entry().content} />;
                  }
                }}
              </Index>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
