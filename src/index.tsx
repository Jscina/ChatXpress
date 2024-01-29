/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "highlight.js/styles/tokyo-night-dark.css";
import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
