/* @refresh reload */
import { render } from "solid-js/web";

import "./styles.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
