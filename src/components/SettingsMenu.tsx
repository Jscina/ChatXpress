import { createSignal } from "solid-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "./ui/dialog";

import { updateApiKey } from "../api/assistant";

interface MenuItemProps {
  name: string;
  children: any;
}

const SettingsItem = ({ name, children }: MenuItemProps) => {
  return (
    <div class="flex flex-row justify-between items-center p-4">
      <p class="mr-4 text-black dark:text-white">{name}</p>
      <div class="flex justify-end gap-3">{children}</div>
    </div>
  );
};

interface SettingsMenuProps {
  open: () => boolean;
  setOpen: (val: boolean) => void;
  setApiKey: (val: string) => void;
  apiKey: () => string;
}

const SettingsMenu = (props: SettingsMenuProps) => {
  const [apiKeyReveal, setApiKeyReveal] = createSignal(false);

  return (
    <>
      <Dialog open={props.open()}>
        <DialogContent class="flex flex-col gap-3 border-none justify-center dark:bg-dark">
          <DialogHeader class="flex flex-row justify-between">
            <DialogTitle class="text-2xl">Settings</DialogTitle>
            <Button
              class="flex justify-center bg-transparent text-black dark:text-white hover:bg-slate-400 dark:hover:bg-gray-500 p-3 mb-1 rounded items-center"
              onClick={() => {
                props.setOpen(!props.open());
              }}
            >
              <i class="fa-solid fa-x"></i>
            </Button>
          </DialogHeader>
          <DialogDescription>
            <SettingsItem name="Api Key">
              <Input
                onChange={async (e) => {
                  props.setApiKey(e.currentTarget.value);
                  await updateApiKey(props.apiKey());
                }}
                type={!apiKeyReveal() ? "password" : "text"}
                placeholder="Enter API Key..."
                value={props.apiKey()}
                class="border-solid border-2 border-neutral-600 dark:bg-dark dark:text-white rounded"
              />
              <Button
                class="hover:bg-slate-400  text-black dark:text-white bg-transparent border-solid border-2 shadow p-3 rounded"
                onClick={() => {
                  setApiKeyReveal(!apiKeyReveal());
                }}
              >
                <i class="fa-regular fa-eye"></i>
              </Button>
            </SettingsItem>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsMenu;
