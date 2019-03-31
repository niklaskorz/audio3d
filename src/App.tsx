import React, { Component } from "react";
import AudioDemo from "./AudioDemo";
import ResAudio from "./audio/ResAudio"

interface State {
  isPlaying: boolean;
}

class App extends Component<{}, State> {
  state: State = {
    isPlaying: false
  };
  demo = new AudioDemo();
  demo2 = new ResAudio();

  togglePlayback = (): void => {
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
      //this.demo.start("/audio/breakbeat.wav");
      this.demo2.play("/audio/breakbeat.wav");
    } else {
      this.setState({ isPlaying: false });
      //this.demo.stop();
      this.demo2.stop();
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
      </div>
    );
  }
}

export default App;
