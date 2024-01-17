import { createSignal, onMount, createEffect, Show } from "solid-js";
import SettingsMenu from "./SettingsMenu";
import clsx from "clsx";
import { Button } from "./ui/button";

interface MenuItemProps {
  name: string;
  onClick?: () => void;
  children?: any;
}

const MenuItem = ({ name, onClick, children }: MenuItemProps) => (
  <li class="p-2 w-full rounded text-gray-300 border-none bg-transparent hover:bg-gray-500">
    <Button
      class="flex flex-row bg-transparent hover:bg-transparent items-center gap-3 p-2"
      onClick={onClick}
    >
      <p>{name}</p>
      {children}
    </Button>
  </li>
);

const UserProfile = () => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const [displayName, setDisplayName] = createSignal("");
  const [apiKey, setApiKey] = createSignal("");
  const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>();
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();

  const openSettings = () => {
    setShowMenu(false);
    dialogRef()?.showModal();
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
            <br />
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
      <SettingsMenu
        apiKey={apiKey}
        setApiKey={setApiKey}
        dialogRef={dialogRef}
        setDialogRef={setDialogRef}
        closeSettings={closeSettings}
      />
    </>
  );
};

export default UserProfile;
