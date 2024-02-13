import clsx from "clsx";
import { createSignal, onMount, createEffect } from "solid-js";
import { listAssistants } from "../api/assistant";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Button } from "./ui/button";
import type { Assistant, Error } from "../types";

interface HeaderProps {
  setActiveAssistant: (assistant: Assistant) => void;
  setSidebarOpen: (val: boolean) => void;
  isSidebarOpen: () => boolean;
  apiKey: () => string;
  error: () => Error | undefined;
  setError: (error: Error | undefined) => void;
}

const Header = ({
  setSidebarOpen,
  isSidebarOpen,
  setActiveAssistant,
  apiKey,
  error,
  setError,
}: HeaderProps) => {
  const [selectedAssistant, setSelectedAssistant] = createSignal<string>("");
  const [assistants, setAssistants] = createSignal<string[]>([]);
  const [availableAssistants, setAvailableAssistants] = createSignal<
    Assistant[]
  >([]);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen());
  };

  let delay = 0;

  createEffect(() => {
    if (selectedAssistant() === "") return;
    const available = availableAssistants();
    if (available.length === 0) return;
    const assistant = available.find(
      (value) => value.name === selectedAssistant(),
    )!;
    setActiveAssistant(assistant);
  });

  const fetchAssistants = async () => {
    try {
      const assistants = await listAssistants();
      setAvailableAssistants(assistants);
      setAssistants(assistants.map((assistant) => assistant.name));
    } catch (e: any) {
      setError({
        title: "Error fetching assistants",
        message: e,
      });
      console.log(error());
    }
  };

  createEffect(async () => {
    if (apiKey() === "") {
      setAssistants([]);
    } else {
      // There's a delay in the API key being set
      // so we need to wait for it to be set before
      // trying to fetch the assistants
      setTimeout(async () => {
        await fetchAssistants();
      }, delay);
    }
  });

  onMount(() => {
    delay = 500;
  });

  return (
    <>
      <header
        class={clsx(
          "fixed w-full top-0 left-0 h-16 z-10 bg-header text-white p-4 shadow-md flex items-center transition-transform ease-in-out duration-300",
          {
            "translate-x-w-54": isSidebarOpen(),
            "translate-x-0": !isSidebarOpen(),
          },
        )}
      >
        <Button
          class={clsx(
            "relative bg-transparent hover:bg-transparent focus:outline-none p-2",
            {
              hidden: isSidebarOpen(),
              block: !isSidebarOpen(),
            },
          )}
          onClick={toggleSidebar}
        >
          <i class="fa-solid fa-bars"></i>
        </Button>
        <div class="transform transition-transform ease-in-out duration-300">
          <Select
            value={selectedAssistant()}
            onChange={setSelectedAssistant}
            options={assistants()}
            placeholder="Select an assistant…"
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger
              aria-label="Assistant"
              class="w-[180px] border-none focus:outline-none focus:border-none"
            >
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent class="dark:bg-dark dark:text-white border-none shadow-md" />
          </Select>
        </div>
      </header>
    </>
  );
};

export default Header;
