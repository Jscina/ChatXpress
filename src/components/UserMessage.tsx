import { Show, onMount, createSignal } from "solid-js";
import { countTokens } from "../api/assistant";

interface UserMessageProps {
  message: string;
  tokens?: number;
}

const UserMessage = ({ message, tokens }: UserMessageProps) => {
  const [inputTokens, setInputTokens] = createSignal<number | undefined>(
    tokens,
  );
  if (message === "") {
    return null;
  }

  onMount(async () => {
    if (inputTokens() === undefined || inputTokens() === 0) {
      setInputTokens(await countTokens(message));
    }
  });

  return (
    <div class="relative flex flex-col bg-neutral-200 dark:bg-neutral-600">
      <Show when={inputTokens() && inputTokens() !== 0}>
        <p class="absolute top-0 right-0 p-4">Tokens: {inputTokens()}</p>
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
