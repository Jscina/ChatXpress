import { createEffect } from "solid-js";

interface ChatWindowProps {
  message: () => string;
}

const ChatWindow = ({ message }: ChatWindowProps) => {
  createEffect(() => {
    if (message()) {
      console.log(message());
    }
  });

  return (
    <>
      <div class="flex-grow justify-center overflow-auto max-h-[calc(100vh-14rem)]">
        <div class="flex items-center justify-center">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex justify-center grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45 w-4/5">
            <div class="flex flex-col w-1/2 self-center border-none rounded-lg"></div>
          </div>
          <div class="flex-shrink-0 w-16"></div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
