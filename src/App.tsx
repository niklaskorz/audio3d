import React, { Component } from "react";
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import Scene from "./react-resonance/Scene";
import Source from "./react-resonance/Source";
import "./App.css";
import { Vector3 } from "./react-resonance/utils";

const dimensions: RoomDimensions = {
  width: 5,
  height: 5,
  depth: 5
};

const materials: RoomMaterials = {
  left: "brick-bare",
  right: "curtain-heavy",
  front: "marble",
  back: "glass-thin",
  down: "grass",
  up: "transparent"
};

/**
 * f(0s) = (0, 1)
 * f(1s) = (1, 0)
 * f(2s) = (0, -1)
 * f(3s) = (-1, 0)
 * f(4s) = (0, 1)
 * f(t) = (sin(t / 4s * 2 * pi), cos(t / 4s * 2 * pi))
 */

const f = (t: number): Vector3 => [
  3 * Math.sin((t / 4000) * 2 * Math.PI),
  0,
  3 * Math.cos((t / 4000) * 2 * Math.PI)
];

interface State {
  position: Vector3;
  isPlaying: boolean;
}

class App extends Component<{}, State> {
  state: State = {
    position: [0, 0, 1],
    isPlaying: false
  };
  raf!: number;
  lastT: number = 0;

  /*
  componentDidMount(): void {
    this.raf = requestAnimationFrame(this.updatePosition);
  }

  componentWillUnmount(): void {
    cancelAnimationFrame(this.raf);
  }

  updatePosition: FrameRequestCallback = t => {
    if (t - this.lastT >= 100) {
      this.lastT = t;
      this.setState({ position: f(t) });
    }
    this.raf = requestAnimationFrame(this.updatePosition);
  };
  */

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <button
            onClick={() =>
              this.setState(state => ({
                isPlaying: !state.isPlaying
              }))
            }
          >
            {this.state.isPlaying ? "Stop" : "Start"} audio
          </button>

          <div>
            <h2>Position</h2>
            <p>
              <button onClick={() => this.setState({ position: [-1, 0, 0] })}>
                Left
              </button>
              <button onClick={() => this.setState({ position: [1, 0, 0] })}>
                Right
              </button>
              <button onClick={() => this.setState({ position: [0, 0, 1] })}>
                Front
              </button>
              <button onClick={() => this.setState({ position: [0, 0, -1] })}>
                Back
              </button>
              <button onClick={() => this.setState({ position: [0, 1, 0] })}>
                Top
              </button>
              <button onClick={() => this.setState({ position: [0, -1, 0] })}>
                Bottom
              </button>
            </p>
          </div>
        </header>

        {this.state.isPlaying && (
          <Scene
            ambisonicOrder={3}
            dimensions={dimensions}
            materials={materials}
          >
            <Source src="/audio/wind.m4a" position={this.state.position} />
          </Scene>
        )}
      </div>
    );
  }
}

export default App;
