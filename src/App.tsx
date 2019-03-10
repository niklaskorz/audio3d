import React, { Component } from "react";
import SceneCanvas from "./3d/SceneCanvas";
import "./App.css";
import AudioDemo from "./AudioDemo";

interface State {
  isPlaying: boolean;
}

class App extends Component<{}, State> {
  state: State = {
    isPlaying: false
  };
  demo = new AudioDemo();

  togglePlayback = (): void => {
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
      this.demo.start("/audio/breakbeat.wav");
    } else {
      this.setState({ isPlaying: false });
      this.demo.stop();
    }
  };

  render(): React.ReactNode {
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
        <SceneCanvas />
      </div>
    );
  }
}

export default App;
