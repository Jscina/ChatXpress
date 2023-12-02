import { createSignal, onMount, createEffect, Show } from "solid-js";
import clsx from "clsx";

interface MenuItemProps {
  name: string;
  onClick?: () => void;
}

const MenuItem = ({ name, onClick }: MenuItemProps) => (
  <li class="p-2">
    <button
      class="text-gray-300 border-none bg-transparent p-2 rounded hover:bg-gray-500"
      onClick={onClick}>
      {name}
    </button>
  </li>
);

const UserProfile = () => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const [ApiKeyReveal, setApiKeyReveal] = createSignal(false);
  const [displayName, setDisplayName] = createSignal("");
  const [userName, setUserName] = createSignal("");
  const [apiKey, setApiKey] = createSignal("");
  const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>();

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

  createEffect(() => {
    if (userName() !== "") {
      setDisplayName(userName());
    }
  });

  onMount(() => {
    setDisplayName("Settings");
  });

  return (
    <>
      <div
        class="flex flex-row justify-between items-center p-4 rounded hover:bg-gray-600 cursor-pointer"
        onClick={toggleMenu}>
        <p>{displayName()}</p>
        <i class="fa-solid fa-ellipsis text-xs"></i>
      </div>
      <Show when={showMenu()}>
        <div class="bg-sidebar p-5 shadow-md absolute left-8 bottom-20 z-50">
          <ul class="flex flex-col rounded-md p-2">
            <MenuItem name="Settings" onClick={openSettings} />
            <hr />
            <MenuItem name="Quit" />
          </ul>
        </div>
      </Show>
      <dialog
        class="absolute left-0 top-1/4 dark:bg-sidebar shadow-lg dark:text-white p-4 w-1/2 h-1/2 min-w-min rounded"
        ref={setDialogRef}>
        <div class="flex flex-row justify-between">
          <h1 class="text-2xl">Settings</h1>
          <button
            class="flex justify-center hover:bg-slate-400 dark:hover:bg-gray-500 p-3 mb-1 rounded items-center"
            onClick={closeSettings}>
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <hr />
        <br />
        <div class="flex flex-col gap-3 justify-center">
          <div class="flex flex-row items-center justify-between p-4">
            <p class="mr-4">User Name</p>
            <input
              onChange={(e) => {
                setUserName(e.currentTarget.value);
              }}
              type="text"
              placeholder="Enter User Name..."
              value={userName()}
              class="border-solid border-2 border-neutral-600 dark:bg-dark dark:text-white rounded p-2 mr-10"
            />
          </div>
          <div class="flex flex-row items-center justify-between p-4">
            <p class="mr-4">Theme</p>
            <button
              class="border-solid border-neutral-600 dark:border-white border-2 rounded p-2 hover:bg-slate-400"
              onClick={toggleDarkMode}>
              <i
                class={clsx(
                  "fa-solid",
                  { "fa-moon": !darkMode() },
                  { "fa-sun": darkMode() }
                )}></i>
            </button>
          </div>
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
                }}>
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
