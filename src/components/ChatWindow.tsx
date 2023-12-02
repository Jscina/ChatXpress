import { createSignal, onMount, For } from "solid-js";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import { AIRole, type ChatMessage } from "../types";

const ChatWindow = () => {
  const [history, setHistory] = createSignal<ChatMessage[] | null>(null);

  onMount(async () => {
    setHistory([
      {
        role: AIRole.USER,
        content:
          "Hello, how are you today. Do you want to talk about anything? I am here to listen :) Let me know if you want to talk about anything. I am here to listen :)",
      },
      {
        role: AIRole.ASSISTANT,
        content: "Hi, I am doing well. How are you? I am here to listen :)",
      },
      {
        role: AIRole.USER,
        content:
          "Certainly! Here's a paragraph discussing the evolution and impact of technology in modern society: In the vast expanse of human history, the rapid evolution of technology in recent times stands as a monumental testament to human ingenuity and the relentless pursuit of progress. From the early days of simple tools and rudimentary machines, we have advanced to an era where technology permeates every facet of our lives, reshaping the way we communicate, work, and even think. The digital revolution, spearheaded by the advent of the internet and the proliferation of smart devices, has ushered in an age of unprecedented connectivity and information exchange, effectively turning the world into a global village. This transformation has not only enabled instant communication across continents but has also facilitated the emergence of a new digital economy, where data is as valuable as traditional physical assets. However, with great power comes great responsibility, and the technological era is fraught with challenges. Issues like data privacy, cybersecurity, and the digital divide pose significant ethical and practical dilemmas. Moreover, the relentless pace of innovation often outstrips our ability to adapt, leaving societal, legal, and regulatory frameworks scrambling to keep up. Despite these challenges, the potential of technology to drive positive change remains immense. Advances in fields like artificial intelligence, biotechnology, and renewable energy hold the promise of solving some of the most pressing global problems, from climate change to healthcare. As we continue to navigate this complex landscape, it is imperative that we harness technology not just for economic growth but also for the betterment of society as a whole, ensuring that its benefits are equitably distributed and its perils responsibly managed. In this journey, the role of education, policy-making, and ethical considerations becomes paramount, guiding us towards a future where technology continues to be a force for good, fueling human progress while preserving the core values that define our humanity.",
      },
    ]);
  });

  return (
    <>
      <div class="flex-grow overflow-auto max-h-[calc(100vh-14rem)] w-full h-full">
        <div class="flex">
          <div class="space-y-4 overflow-y-scroll overflow-x-hidden flex-grow shadowflex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out max-h-45">
            <div class="flex flex-col justify-center self-center border-none rounded-lg">
              <For each={history()}>
                {(message) => {
                  switch (message.role) {
                    case AIRole.USER:
                      return <UserMessage message={message.content} />;
                    case AIRole.ASSISTANT:
                      return <AssistantMessage message={message.content} />;
                  }
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
