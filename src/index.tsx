import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import Editor from "./editor/Editor";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

// Safari does not yet support the Web Audio API without a prefix
if (!window.AudioContext && window.webkitAudioContext) {
  window.AudioContext = window.webkitAudioContext;
}

// Check if we're running as a desktop app through NW.js
if (window.nw) {
  const nw = window.nw;
  const w = nw.Window.get();
  // Maximize the window on start
  w.maximize();
  w.focus();
  // Ensure external links open in the OS' browser instead of a
  // new window in the app.
  w.on("new-win-policy", (frame, url, policy) => {
    if (policy && url) {
      policy.ignore();
      nw.Shell.openExternal(url);
    }
  });
  // Ask the user for confirmation when closing the window,
  // to ensure there are no unsaved changes.
  w.on("close", () => {
    if (
      confirm("Do you really want to quit? There might be unsaved changes.")
    ) {
      // Finally, force close to avoid this event being triggered again
      w.close(true);
    }
  });
}

if (process.env.NODE_ENV === "production") {
  // If we are running in the production environment, make sure the user
  // does not close the editor unintentionally.
  window.addEventListener("beforeunload", e => e.preventDefault());
}

ReactDOM.render(<Editor />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
