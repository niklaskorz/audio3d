import React from "react";
import {
  ResonanceAudio,
  RoomDimensions,
  RoomMaterials,
  Utils
} from "resonance-audio";
import { Provider as AudioContextProvider } from "./AudioContext";
import SceneContext from "./SceneContext";
import {
  Vector3,
  isEqualVector3,
  isEqualRoomDimensions,
  isEqualRoomMaterials
} from "./utils";
import { threadId } from "worker_threads";

interface OwnProps {
  state?: AudioContextState;
  ambisonicOrder?: number;
  listenerPosition?: Vector3;
  listenerForward?: Vector3;
  listenerUp?: Vector3;
  dimensions?: RoomDimensions;
  materials?: RoomMaterials;
  speedOfSound?: number;
}

type Props = OwnProps;

class Scene extends React.Component<Props> {
  audioContext: AudioContext;
  scene: ResonanceAudio;

  constructor(props: Props) {
    super(props);
    const {
      children,
      state,
      listenerPosition,
      listenerForward,
      listenerUp,
      ...options
    } = this.props;
    this.audioContext = new AudioContext();
    this.scene = new ResonanceAudio(this.audioContext, {
      ...options,
      listenerPosition: listenerPosition && new Float32Array(listenerPosition),
      listenerForward: listenerForward && new Float32Array(listenerForward),
      listenerUp: listenerUp && new Float32Array(listenerUp)
    });
  }

  updateAudioContextState(state: AudioContextState = "running"): void {
    if (this.audioContext.state !== state) {
      if (state === "running") {
        this.audioContext.resume();
      } else if (state === "suspended") {
        this.audioContext.suspend();
      } else if (state === "closed") {
        this.audioContext.close();
      }
    }
  }

  componentDidMount(): void {
    this.updateAudioContextState(this.props.state);
    this.scene.output.connect(this.audioContext.destination);
  }

  componentWillUnmount(): void {
    this.scene.output.disconnect();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      state,
      ambisonicOrder,
      listenerPosition,
      listenerForward,
      listenerUp,
      dimensions,
      materials,
      speedOfSound
    } = this.props;

    this.updateAudioContextState(state);

    if (ambisonicOrder !== prevProps.ambisonicOrder) {
      this.scene.setAmbisonicOrder(
        ambisonicOrder != null ? ambisonicOrder : Utils.DEFAULT_AMBISONIC_ORDER
      );
    }
    if (!isEqualVector3(listenerPosition, prevProps.listenerPosition)) {
      const [x, y, z] = listenerPosition || Utils.DEFAULT_POSITION;
      this.scene.setListenerPosition(x, y, z);
    }
    if (
      !isEqualVector3(listenerForward, prevProps.listenerForward) &&
      !isEqualVector3(listenerUp, prevProps.listenerUp)
    ) {
      const [forwardX, forwardY, forwardZ] =
        listenerForward || Utils.DEFAULT_FORWARD;
      const [upX, upY, upZ] = listenerUp || Utils.DEFAULT_UP;
      this.scene.setListenerOrientation(
        forwardX,
        forwardY,
        forwardZ,
        upX,
        upY,
        upZ
      );
    }
    if (
      !isEqualRoomDimensions(dimensions, prevProps.dimensions) ||
      !isEqualRoomMaterials(materials, prevProps.materials)
    ) {
      this.scene.setRoomProperties(
        dimensions || Utils.DEFAULT_ROOM_DIMENSIONS,
        materials || Utils.DEFAULT_ROOM_MATERIALS
      );
    }
    if (speedOfSound !== prevProps.speedOfSound) {
      this.scene.setSpeedOfSound(
        speedOfSound != null ? speedOfSound : Utils.DEFAULT_SPEED_OF_SOUND
      );
    }
  }

  render(): React.ReactNode {
    return (
      <AudioContextProvider value={this.audioContext}>
        <SceneContext.Provider value={this.scene}>
          {this.props.children}
        </SceneContext.Provider>
      </AudioContextProvider>
    );
  }
}

export default Scene;
