import { onMount, createSignal } from "solid-js";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import DOMPurify from "dompurify";

interface AssistantMessageProps {
  message: string;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  const [markdownContent, setMarkdownContent] = createSignal<string>(message);

  onMount(async () => {
    const markedContent = await marked(message);
    const sanitizedContent = DOMPurify.sanitize(markedContent);
    setMarkdownContent(sanitizedContent);
    hljs.highlightAll();
  });

  if (message === "") {
    return null;
  }

  return (
    <div class="flex justify-center p-4">
      <div class="flex p-2 max-w-[50%] w-full">
        <div class="flex" innerHTML={markdownContent()} />
      </div>
    </div>
  );
};

export default AssistantMessage;
