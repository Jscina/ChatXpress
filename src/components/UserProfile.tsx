import { createSignal, onMount, createEffect, Show } from "solid-js";
import SettingsMenu from "./SettingsMenu";
import clsx from "clsx";
import { Button } from "./ui/button";
import type { ChatStore, SetChatStore } from "../types";

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

interface UserProfileProps {
  chatStore: ChatStore;
  setChatStore: SetChatStore;
}

const UserProfile = ({ chatStore, setChatStore }: UserProfileProps) => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(false);
  const [displayName, setDisplayName] = createSignal("");
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();
  const [open, setOpen] = createSignal(false);

  const openSettings = () => {
    setShowMenu(false);
    setOpen(true);
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode());
    localStorage.setItem("darkMode", JSON.stringify(darkMode()));
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

  createEffect(() => {
    if (chatStore.apiKey !== "" && chatStore.error) {
      setChatStore("error", null);
    }
  });

  onMount(() => {
    setDisplayName("Settings");

    const darkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
    if (darkMode) {
      toggleDarkMode();
    }
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
        open={open}
        setOpen={setOpen}
        chatStore={chatStore}
        setChatStore={setChatStore}
      />
    </>
  );
};

export default UserProfile;
