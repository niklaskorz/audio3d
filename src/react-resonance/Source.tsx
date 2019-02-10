import React from "react";
import { Source as ResonanceSource, Utils } from "resonance-audio";
import { SceneProps, withScene } from "./SceneContext";
import { AudioContextProps, withAudioContext } from "./AudioContext";

type Triple<T> = [T, T, T];
type Vector3 = Triple<number> | Float32Array;

const isEqualVector3 = (a?: Vector3, b?: Vector3): boolean =>
  a === b ||
  (a != null && b != null && a[0] === b[0] && a[1] === b[1] && a[2] === b[2]);

interface OwnProps {
  src: string;

  position?: Vector3;
  forward?: Vector3;
  up?: Vector3;
  minDistance?: number;
  maxDistance?: number;
  rollof?: string;
  gain?: number;
  alpha?: number;
  sharpness?: number;
  sourceWidth?: number;
}

type Props = OwnProps & AudioContextProps & SceneProps;

class Source extends React.Component<Props> {
  buffer: AudioBuffer | null = null;
  audioSource!: AudioBufferSourceNode;
  source!: ResonanceSource;

  async componentDidMount(): Promise<void> {
    const {
      src,
      audioContext,
      scene,
      position,
      forward,
      up,
      ...options
    } = this.props;
    this.audioSource = audioContext.createBufferSource();
    this.audioSource.loop = true;
    this.source = scene.createSource({
      ...options,
      position: position && new Float32Array(position),
      forward: forward && new Float32Array(forward),
      up: up && new Float32Array(up)
    });
    this.audioSource.connect(this.source.input);

    if (!this.buffer) {
      const resp = await fetch(this.props.src);
      const data = await resp.arrayBuffer();
      this.buffer = await this.props.audioContext.decodeAudioData(data);
    }
    this.audioSource.buffer = this.buffer;
    this.audioSource.start();
  }

  componentWillUnmount(): void {
    this.audioSource.stop();
    this.audioSource.disconnect();
    delete this.audioSource;
    delete this.source;
  }

  componentDidUpdate(prevProps: Props): void {
    const {
      position,
      forward,
      up,
      minDistance,
      maxDistance,
      rollof,
      gain,
      alpha,
      sharpness,
      sourceWidth
    } = this.props;

    if (!isEqualVector3(position, prevProps.position)) {
      const [x, y, z] = position || Utils.DEFAULT_POSITION;
      this.source.setPosition(x, y, z);
    }
    if (
      !isEqualVector3(forward, prevProps.forward) &&
      !isEqualVector3(up, prevProps.up)
    ) {
      const [forwardX, forwardY, forwardZ] = forward || Utils.DEFAULT_FORWARD;
      const [upX, upY, upZ] = up || Utils.DEFAULT_UP;
      this.source.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
    }
    if (minDistance !== prevProps.minDistance) {
      this.source.setMinDistance(
        minDistance != null ? minDistance : Utils.DEFAULT_MIN_DISTANCE
      );
    }
    if (maxDistance !== prevProps.maxDistance) {
      this.source.setMaxDistance(
        maxDistance != null ? maxDistance : Utils.DEFAULT_MAX_DISTANCE
      );
    }
    if (rollof !== prevProps.rollof) {
      this.source.setRolloff(rollof || Utils.DEFAULT_ATTENUATION_ROLLOFF);
    }
    if (gain !== prevProps.gain) {
      this.source.setGain(gain != null ? gain : Utils.DEFAULT_SOURCE_GAIN);
    }
    if (alpha !== prevProps.alpha || sharpness !== prevProps.sharpness) {
      this.source.setDirectivityPattern(
        alpha != null ? alpha : Utils.DEFAULT_DIRECTIVITY_ALPHA,
        sharpness != null ? sharpness : Utils.DEFAULT_DIRECTIVITY_SHARPNESS
      );
    }
    if (sourceWidth !== prevProps.sourceWidth) {
      this.source.setSourceWidth(
        sourceWidth != null ? sourceWidth : Utils.DEFAULT_SOURCE_WIDTH
      );
    }
  }

  render(): React.ReactNode {
    return null;
  }
}

export default withAudioContext(withScene(Source));
