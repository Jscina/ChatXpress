import clsx from "clsx";
import { createSignal, onMount } from "solid-js";
import { listAssistants } from "../api/assistant";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface HeaderProps {
  setSidebarOpen: (val: boolean) => void;
  isSidebarOpen: () => boolean;
}

const Header = ({ setSidebarOpen, isSidebarOpen }: HeaderProps) => {
  const [selectedAssistant, setSelectedAssistant] = createSignal<string>("");
  const [assistants, setAssistants] = createSignal<string[]>([]);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen());
  };

  onMount(async () => {
    const assistants = await listAssistants();
    setAssistants(assistants.map((assistant) => assistant.name));
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
        <button
          class={clsx("relative focus:outline-none p-2", {
            hidden: isSidebarOpen(),
            block: !isSidebarOpen(),
          })}
          onClick={toggleSidebar}
        >
          <i class="fa-solid fa-bars"></i>
        </button>
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
            <SelectTrigger aria-label="Fruit" class="w-[180px]">
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>{" "}
        </div>
      </header>
    </>
  );
};

export default Header;
