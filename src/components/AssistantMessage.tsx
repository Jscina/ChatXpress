import { onMount, createSignal, Show } from "solid-js";
import { marked } from "marked";
import hljs from "highlight.js";
import DOMPurify from "dompurify";

const ErrorMessage = () => {
  return (
    <div class="flex justify-center p-4">
      <div class="flex p-2 max-w-[50%] w-full">
        <div class="flex">
          <p class="p-4 border-solid border-red-600 bg-red-400 rounded">
            An error has occured
          </p>
        </div>
      </div>
    </div>
  );
};

interface AssistantMessageProps {
  message: string;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  const [markdownContent, setMarkdownContent] = createSignal<string>("");
  const [errorOccured, setErrorOccured] = createSignal<boolean>(false);

  onMount(async () => {
    if (!message) {
      setErrorOccured(true);
      return;
    }
    const markedContent = await marked(message);
    const sanitizedContent = DOMPurify.sanitize(markedContent);
    setMarkdownContent(sanitizedContent);
    hljs.highlightAll();
  });

  if (message === "") {
    setErrorOccured(true);
    return;
  }

  return (
    <Show when={!errorOccured()} fallback={<ErrorMessage />}>
      <div class="flex justify-center p-4">
        <div class="flex p-2 max-w-[50%] w-full">
          <div class="w-full max-w-screen-lg" innerHTML={markdownContent()} />
        </div>
      </div>
    </Show>
  );
};

export default AssistantMessage;
