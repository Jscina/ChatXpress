import { Show } from "solid-js";

interface UserMessageProps {
  message: string;
  tokens?: number;
}

const UserMessage = ({ message, tokens }: UserMessageProps) => {
  if (message === "") {
    return null;
  }

  return (
    <div class="relative flex flex-col bg-neutral-200 dark:bg-neutral-600">
      <Show when={tokens && tokens !== 0}>
        <p class="absolute top-0 right-0 p-4">Tokens: {tokens}</p>
      </Show>
      <div class="flex flex-row justify-center p-4">
        <div class="flex p-2 max-w-[50%] w-full">
          <div class="flex max-w-screen-lg">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
