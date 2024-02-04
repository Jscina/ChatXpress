import { onMount, createSignal } from "solid-js";
import { countTokens } from "../api/assistant";

interface UserMessageProps {
  message: string;
}

const UserMessage = ({ message }: UserMessageProps) => {
  const [tokens, setTokens] = createSignal(0);
  if (message === "") {
    return null;
  }

  onMount(async () => {
    const tokenCount = await countTokens(message);
    setTokens(tokenCount);
  });

  return (
    <div class="relative flex flex-col bg-neutral-200 dark:bg-neutral-600">
      <p class="absolute top-0 right-0 p-4">Tokens: {tokens()}</p>
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
