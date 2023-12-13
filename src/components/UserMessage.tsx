import { onMount } from "solid-js";

interface UserMessageProps {
  message: string;
  setMessage: (message: string) => void;
}

const UserMessage = ({ message, setMessage }: UserMessageProps) => {
  onMount(() => {
    if (false) {
      // This will be used to allowing edit states for the user message
      setMessage("");
    }
  });
  return (
    <div class="flex justify-center p-4 bg-neutral-200 dark:bg-neutral-600">
      <div class="flex p-2 max-w-[50%] w-full">
        <div class="flex">
          <p class="flex">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
