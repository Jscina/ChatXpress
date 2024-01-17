import { createSignal } from "solid-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface MenuItemProps {
  name: string;
  children: any;
}

const SettingsItem = ({ name, children }: MenuItemProps) => {
  return (
    <div class="flex flex-row justify-between items-center p-4">
      <p class="mr-4">{name}</p>
      <div class="flex justify-end gap-3">{children}</div>
    </div>
  );
};

interface SettingsMenuProps {
  apiKey: () => string;
  setApiKey: (value: string) => void;
  dialogRef: () => HTMLDialogElement | undefined;
  setDialogRef: (value: HTMLDialogElement) => void;
  closeSettings: () => void;
}

const SettingsMenu = (props: SettingsMenuProps) => {
  const [apiKeyReveal, setApiKeyReveal] = createSignal(false);
  return (
    <dialog
      class="absolute left-0 top-1/4 dark:bg-sidebar shadow-lg dark:text-white p-4 w-1/2 h-1/2 min-w-min rounded"
      ref={props.setDialogRef}
    >
      <div class="flex flex-row justify-between">
        <h1 class="text-2xl">Settings</h1>
        <Button
          class="flex justify-center bg-transparent hover:bg-slate-400 dark:hover:bg-gray-500 p-3 mb-1 rounded items-center"
          onClick={props.closeSettings}
        >
          <i class="fa-solid fa-x"></i>
        </Button>
      </div>
      <hr />
      <br />
      <div class="flex flex-col gap-3 justify-center">
        <SettingsItem name="Api Key">
          <Input
            onChange={(e) => {
              props.setApiKey(e.currentTarget.value);
            }}
            type={!apiKeyReveal() ? "password" : "text"}
            placeholder="Enter API Key..."
            value={props.apiKey()}
            class="border-solid border-2 border-neutral-600 dark:bg-dark dark:text-white rounded"
          />
          <Button
            class="hover:bg-slate-400 bg-transparent border-solid border-2 shadow p-3 rounded"
            onClick={() => {
              setApiKeyReveal(!apiKeyReveal());
            }}
          >
            <i class="fa-regular fa-eye"></i>
          </Button>
        </SettingsItem>

        <SettingsItem name="Register Assistant">
          <Input
            onChange={(_) => {}}
            type="text"
            placeholder="Enter Assistant ID..."
            value={props.apiKey()}
            class="border-solid border-2 border-neutral-600 dark:bg-dark dark:text-white rounded"
          />
          <Button
            class="hover:bg-slate-400 bg-transparent border-solid border-2 shadow p-3 rounded"
            onClick={() => {}}
          >
            <i class="fa-regular fa-plus"></i>
          </Button>
        </SettingsItem>
      </div>
    </dialog>
  );
};

export default SettingsMenu;
