import { createSignal, createEffect, Show } from "solid-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import { deleteThread, updateThread, listThreads } from "../api/database";
import type { ChatMessage, Thread } from "../types";

interface EditableItemProps {
  name: string;
  thread: Thread;
  setName: (val: string) => void;
  toggleEditable: () => void;
}

const EditableItem = ({
  name,
  thread,
  setName,
  toggleEditable,
}: EditableItemProps) => {
  const [newName, setNewName] = createSignal(name);

  const updateName = () => {
    if (newName() !== name || newName() !== "") {
      setName(newName());
    }
    toggleEditable();
  };

  createEffect(() => {
    if (newName() !== "") {
      thread.name = newName();
      updateThread(thread);
    }
  });

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

interface ConfirmDeleteProps {
  thread: Thread;
  open: () => boolean;
  setOpen: (val: boolean) => void;
  setDisabled: (val: boolean) => void;
  activeThread: () => Thread | undefined;
  setActiveThread: (val: Thread | undefined) => void;
  setChatHistory: (val: ChatMessage[]) => void;
}

const ConfirmDelete = ({
  thread,
  open,
  setOpen,
  setDisabled,
  activeThread,
  setActiveThread,
  setChatHistory,
}: ConfirmDeleteProps) => {
  const handleDelete = async () => {
    if (activeThread()?.id === thread.id) {
      setActiveThread(undefined);
      setChatHistory([]);
    }
    try {
      // If we can't delete the thread then it wasn't added to the database
      await deleteThread(thread);
    } finally {
      setOpen(false);
    }
    setDisabled(true);
  };

  return (
    <>
      <Dialog open={open()}>
        <DialogContent class="border-none dark:bg-dark dark:text-white text-black">
          <DialogDescription class="flex flex-col">
            <div class="flex items-center justify-center">
              <p class="dark:text-white text-black">
                Are you sure you want to delete this chat?
              </p>
            </div>
            <div class="flex flex-row items-center mt-2 justify-center">
              <Button
                onClick={handleDelete}
                class="rounded border-solid border-2 text-black dark:text-white bg-transparent hover:bg-red-600 dark:hover:bg-red-700 ml-2"
              >
                Delete
              </Button>
              <Button
                onClick={() => setOpen(!open())}
                class="rounded border-solid border-2 text-black dark:text-white bg-transparent hover:bg-gray-400 dark:hover:bg-gray-500 ml-2"
              >
                Cancel
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface NonEditableItemProps {
  thread: Thread;
  toggleEditable: () => void;
  disabled: () => boolean;
  setActiveThread: (val: Thread | undefined) => void;
  setOpen: (val: boolean) => void;
}

const NonEditableItem = ({
  thread,
  toggleEditable,
  disabled,
  setActiveThread,
  setOpen,
}: NonEditableItemProps) => {
  const loadHistory = () => {
    setActiveThread(thread);
  };

  const deleteHistory = async () => {
    if (!disabled()) setOpen(true);
  };

  return (
    <>
      <div class="flex justify-between w-full">
        <Button
          class="bg-transparent hover:bg-transparent"
          onClick={loadHistory}
        >
          {thread.name ?? "New Chat"}
        </Button>
        <div class="flex gap-1">
          <Button
            class="flex p-2 hover:text-neutral-500 bg-transparent hover:bg-transparent"
            onClick={toggleEditable}
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            onClick={deleteHistory}
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
  thread: Thread;
  activeThread: () => Thread | undefined;
  setHistory: (val: Thread[] | null) => void;
  setChatHistory: (val: ChatMessage[]) => void;
  setActiveThread: (val: Thread | undefined) => void;
}

const HistoryItem = ({
  thread,
  activeThread,
  setActiveThread,
  setHistory,
  setChatHistory,
}: HistoryItemProps) => {
  const [editable, setEditable] = createSignal(false);
  const [name, setName] = createSignal(thread.name);
  const [disabled, setDisabled] = createSignal(false);
  const [open, setOpen] = createSignal(false);
  const toggleEditable = () => setEditable(!editable());

  createEffect(() => {
    thread.name = name();
  });

  createEffect(async () => {
    if (disabled()) {
      const threads = await listThreads();
      setHistory(threads);
    }
  });

  return (
    <>
      <Show when={!disabled()} fallback={null}>
        <div class="flex flex-row justify-between border-solid border-white border rounded">
          <Show
            when={!editable()}
            fallback={
              <EditableItem
                thread={thread}
                name={name() ?? "New Chat"}
                setName={setName}
                toggleEditable={toggleEditable}
              />
            }
          >
            <NonEditableItem
              thread={thread}
              toggleEditable={toggleEditable}
              disabled={disabled}
              setOpen={setOpen}
              setActiveThread={setActiveThread}
            />
          </Show>
        </div>
      </Show>
      <ConfirmDelete
        thread={thread}
        open={open}
        setOpen={setOpen}
        setDisabled={setDisabled}
        activeThread={activeThread}
        setChatHistory={setChatHistory}
        setActiveThread={setActiveThread}
      />
    </>
  );
};

export default HistoryItem;
