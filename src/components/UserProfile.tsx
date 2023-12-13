import { createSignal, onMount, createEffect, Show } from "solid-js";
import clsx from "clsx";

interface MenuItemProps {
  name: string;
  onClick?: () => void;
  children?: any;
}

const MenuItem = ({ name, onClick, children }: MenuItemProps) => (
  <li class="p-2 w-full rounded text-gray-300 border-none bg-transparent hover:bg-gray-500">
    <button class="flex flex-row items-center gap-3 p-2" onClick={onClick}>
      <p>{name}</p>
      {children}
    </button>
  </li>
);

const UserProfile = () => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const [ApiKeyReveal, setApiKeyReveal] = createSignal(false);
  const [displayName, setDisplayName] = createSignal("");
  const [apiKey, setApiKey] = createSignal("");
  const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>();
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();

  const openSettings = () => {
    dialogRef()?.showModal();
    setShowMenu(false);
  };

  const closeSettings = () => {
    dialogRef()?.close();
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode());
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu());
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef()?.contains(event.target as Node)) {
      return;
    }
    setShowMenu(false);
  };

  createEffect(() => {
    if (showMenu()) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  });

  onMount(() => {
    setDisplayName("Settings");
  });

  return (
    <>
      <div
        class="flex flex-row justify-between items-center p-4 rounded hover:bg-gray-600 cursor-pointer"
        onClick={toggleMenu}
      >
        <p>{displayName()}</p>
        <i class="fa-solid fa-ellipsis text-xs"></i>
      </div>
      <Show when={showMenu()}>
        <div
          ref={setMenuRef}
          class="bg-sidebar p-5 shadow-lg absolute left-8 bottom-20 z-50"
        >
          <ul class="flex flex-col rounded-md p-2">
            <MenuItem name="Settings" onClick={openSettings} />
            <br />
            <MenuItem name="Theme" onClick={toggleDarkMode}>
              <i
                class={clsx(
                  "fa-solid",
                  { "fa-moon": !darkMode() },
                  { "fa-sun": darkMode() },
                )}
              ></i>
            </MenuItem>
          </ul>
        </div>
      </Show>
      <dialog
        class="absolute left-0 top-1/4 dark:bg-sidebar shadow-lg dark:text-white p-4 w-1/2 h-1/2 min-w-min rounded"
        ref={setDialogRef}
      >
        <div class="flex flex-row justify-between">
          <h1 class="text-2xl">Settings</h1>
          <button
            class="flex justify-center hover:bg-slate-400 dark:hover:bg-gray-500 p-3 mb-1 rounded items-center"
            onClick={closeSettings}
          >
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <hr />
        <br />
        <div class="flex flex-col gap-3 justify-center">
          <div class="flex flex-row justify-between items-center p-4">
            <p class="mr-4">API Key</p>
            <div class="flex justify-end gap-3">
              <input
                onChange={(e) => {
                  setApiKey(e.currentTarget.value);
                }}
                type={!ApiKeyReveal() ? "password" : "text"}
                placeholder="Enter API Key..."
                value={apiKey()}
                class="border-solid border-2 border-neutral-600 dark:bg-dark dark:text-white rounded"
              />
              <button
                class="hover:bg-slate-400 border-solid border-2 shadow p-2 rounded"
                onClick={() => {
                  setApiKeyReveal(!ApiKeyReveal());
                }}
              >
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UserProfile;
