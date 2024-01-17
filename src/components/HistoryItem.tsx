import { createSignal, createEffect, Show } from "solid-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface EditableItemProps {
  name: string;
  setName: (val: string) => void;
  toggleEditable: () => void;
}

const EditableItem = ({ name, setName, toggleEditable }: EditableItemProps) => {
  const [newName, setNewName] = createSignal(name);

  const updateName = () => {
    if (newName() !== name || newName() !== "") {
      setName(newName());
    }
    toggleEditable();
  };

  return (
    <>
      <div class="flex items-center max-w-full justify-between">
        <Input
          type="text"
          class="bg-transparent border-none"
          style="outline: none !important; box-shadow: none !important;"
          value={name}
          onInput={(e) => setNewName(e.target.value)}
        />
        <div class="flex gap-1">
          <Button
            class="flex p-2 bg-transparent hover:bg-transparent hover:text-green-500"
            onClick={updateName}
          >
            <i class="fa-solid fa-check"></i>
          </Button>
          <Button
            class="flex p-2 bg-transparent hover:bg-transparent hover:text-red-500"
            onClick={toggleEditable}
          >
            <i class="fa-solid fa-x"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

interface NonEditableItemProps {
  name: string;
  toggleEditable: () => void;
  setDisabled: (val: boolean) => void;
}

const NonEditableItem = ({
  name,
  toggleEditable,
  setDisabled,
}: NonEditableItemProps) => {
  return (
    <>
      <div class="flex justify-between w-full">
        <Button class="bg-transparent hover:bg-transparent">{name}</Button>
        <div class="flex gap-1">
          <Button
            class="flex p-2 hover:text-neutral-500 bg-transparent hover:bg-transparent"
            onClick={toggleEditable}
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            onClick={() => {
              setDisabled(true);
            }}
            class="flex p-2 hover:text-red-500 bg-transparent hover:bg-transparent"
          >
            <i class="fa-solid fa-trash"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

interface HistoryItemProps {
  initialName?: string;
}

const HistoryItem = ({ initialName }: HistoryItemProps) => {
  const [editable, setEditable] = createSignal(false);
  const [name, setName] = createSignal(initialName);
  const [disabled, setDisabled] = createSignal(false);
  const toggleEditable = () => setEditable(!editable());

  // This is until we have something to delete
  createEffect(() => {
    if (disabled()) {
      setTimeout(() => {
        setDisabled(false);
      }, 1000);
    }
  });

  return (
    <Show when={!disabled()} fallback={null}>
      <div class="flex flex-row justify-between border-solid border-white border rounded">
        <Show
          when={!editable()}
          fallback={
            <EditableItem
              name={name() ?? "New Chat"}
              setName={setName}
              toggleEditable={toggleEditable}
            />
          }
        >
          <NonEditableItem
            name={name() ?? "New Chat"}
            toggleEditable={toggleEditable}
            setDisabled={setDisabled}
          />
        </Show>
      </div>
    </Show>
  );
};

export default HistoryItem;
