import React from "react";
import ReactDOM from "react-dom";

// Import App
import App from "./App";

// Import react-spinner-loader styles
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// Require Blueprint CSS assets
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "normalize.css";

// Import Blueprint library styles
import "./blueprint.scss";
import "./index.scss";

// Install Fonts
import "assets/fonts/ColfaxWebMedium.ttf";
import "assets/fonts/ColfaxWebMedium.woff";
import "assets/fonts/ColfaxWebRegular.ttf";
import "assets/fonts/ColfaxWebRegular.woff";

// Import service worker
import * as serviceWorker from "./serviceWorker";

const ROOT = document.getElementById("root");

ReactDOM.render(<App />, ROOT);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
