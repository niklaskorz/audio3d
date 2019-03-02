import React, { Component } from "react";
import AudioDemo from "./AudioDemo";
import "./App.css";

interface State {
  isPlaying: boolean;
}

class App extends Component<{}, State> {
  state: State = {
    isPlaying: false
  };
  demo = new AudioDemo();

  togglePlayback = () => {
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
      this.demo.start("/audio/breakbeat.wav");
    } else {
      this.setState({ isPlaying: false });
      this.demo.stop();
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <button onClick={this.togglePlayback}>
            {this.state.isPlaying ? "Stop" : "Start"} audio
          </button>
        </header>
      </div>
    );
  }
}

export default App;
