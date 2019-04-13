/**
 * @author Leon Erath / https://leonerath.de/
 */

import { Object3D, Vector3, Quaternion } from "three";
import BinauralFIR, { HRTF } from "binauralfir";
import { radToDeg } from "../../utils/math";
import AudioNode from "../AudioNode";
import { loadHRTFDataset } from "./hrtf";
import BinauralScene from "./BinauralScene";
import BinauralSource from "./BinauralSource";

/**
 * Class extends Object3D in order to work with the SceneCanvas.
 * The Idea ist to override the positionChange-Methods and change the ResonanceAudio
 * accordingly.
 */

export default class BinauralAudio extends Object3D implements AudioNode {
  audioContext: AudioContext;
  audioSource: AudioBufferSourceNode;
  scene: BinauralScene;
  source: BinauralSource;

  constructor(scene: BinauralScene) {
    super();

    this.scene = scene;
    this.source = scene.createSource();

    this.audioContext = scene.audioContext;
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.connect(this.source.input);
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);

    const quaternion = new Quaternion();
    const scale = new Vector3();

    this.matrixWorld.decompose(this.source.position, quaternion, scale);

    this.source.orientation.set(0, 0, 1).applyQuaternion(quaternion);
    this.source.update();
  }

  setBuffer(buffer: AudioBuffer): void {
    if (this.audioSource.buffer) {
      // Chrome does not allow "resetting" the buffer and throws an error
      // with this message: Cannot set buffer to non-null after it has been already been set to a non-null buffer
      // To circumvent this, we have to create a new buffer source
      this.audioSource.stop();
      this.audioSource.disconnect();
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.connect(this.source.input);
    }
    this.audioSource.buffer = buffer;
  }

  setLoop(loop: boolean): void {
    this.audioSource.loop = loop;
  }

  play(): void {
    this.audioSource.start();
  }

  stop(): void {
    if (this.audioSource.buffer) {
      this.audioSource.stop();
    }
  }
}
