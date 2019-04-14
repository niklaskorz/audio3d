import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import Editor from "./editor/Editor";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const global = window as any;
// Safari does not yet support the Web Audio API without a prefix
if (!global.AudioContext && global.webkitAudioContext) {
  global.AudioContext = global.webkitAudioContext;
}

if (process.env.NODE_ENV === "production") {
  // If we are running in the production environment, make sure the user
  // does not close the editor unintentionally.
  window.addEventListener(
    "beforeunload",
    () =>
      "Do you really want to close the editor? You might have unsaved changes."
  );
}

ReactDOM.render(<Editor />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
