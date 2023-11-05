import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";

const App = () => {
  const [name, setName] = createSignal("Josh");

  const greet = async () => {
    setName(await invoke("greet", { name: name() }));
  };

  onMount(async () => {
    await greet();
  });

  return (
    <>
      <div class="text-3xl bg-black text-green-500">{name()}</div>
    </>
  );
};

export default App;
