import { createSignal, Show } from "solid-js";

interface EditableItemProps {
  name: string;
  setName: (val: string) => void;
  toggleEditable: () => void;
}

const EditableItem = ({ name, setName, toggleEditable }: EditableItemProps) => (
  <div class="flex items-center max-w-full">
    <input
      type="text"
      class="bg-transparent border-b border-white text-white w-full outline-none"
      value={name}
      onInput={(e) => setName(e.target.value)}
    />
    <button
      type="button"
      class="ml-auto hover:text-green-500"
      onClick={toggleEditable}>
      <i class="fa-solid fa-check"></i>
    </button>
    <button
      type="button"
      class="ml-2 hover:text-red-500"
      onClick={toggleEditable}>
      <i class="fa-solid fa-x"></i>
    </button>
  </div>
);

interface NonEditableItemProps {
  name: string;
  toggleEditable: () => void;
}

const NonEditableItem = ({ name, toggleEditable }: NonEditableItemProps) => (
  <>
    <button type="button">{name}</button>
    <button
      type="button"
      class="ml-auto hover:text-neutral-500"
      onClick={toggleEditable}>
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button type="button" class="ml-2 hover:text-red-500">
      <i class="fa-solid fa-trash"></i>
    </button>
  </>
);

interface HistoryItemProps {
  initialName: string;
}

const HistoryItem = ({ initialName }: HistoryItemProps) => {
  const [editable, setEditable] = createSignal(false);
  const [name, setName] = createSignal(initialName);

  const toggleEditable = () => setEditable(!editable());

  return (
    <div class="flex flex-row border-solid border-white border rounded p-2">
      <Show
        when={!editable()}
        fallback={
          <EditableItem
            name={name()}
            setName={setName}
            toggleEditable={toggleEditable}
          />
        }>
        <NonEditableItem name={name()} toggleEditable={toggleEditable} />
      </Show>
    </div>
  );
};

export default HistoryItem;
