import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import Editor from "./editor/Editor";
import App from "./App"
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const global = window as any;
// Safari does not yet support the Web Audio API without a prefix
if (!global.AudioContext && global.webkitAudioContext) {
  global.AudioContext = global.webkitAudioContext;
}

ReactDOM.render(<Editor />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
