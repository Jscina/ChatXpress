import { Show, onMount, createSignal } from "solid-js";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface UserMessageProps {
  message: string;
  tokens?: number;
}

const UserMessage = ({ message, tokens }: UserMessageProps) => {
  const [markdownContent, setMarkdownContent] = createSignal<string>(message);

  onMount(async () => {
    if (!message) {
      return;
    }
    const markedContent = await marked(message);
    const sanitizedContent = DOMPurify.sanitize(markedContent);
    setMarkdownContent(sanitizedContent);
  });

  return (
    <div class="relative flex flex-col bg-neutral-200 dark:bg-neutral-600">
      <Show when={tokens && tokens !== 0}>
        <p class="absolute top-0 right-0 p-4">Tokens: {tokens}</p>
      </Show>
      <div class="flex flex-row justify-center p-4">
        <div class="flex p-2 max-w-[50%] w-full">
          <div class="w-full max-w-screen-lg" innerHTML={markdownContent()} />
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
