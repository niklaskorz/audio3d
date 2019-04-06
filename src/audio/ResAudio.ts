/**
 * @author Leon Erath / https://leonerath.de/
 */

import { ResonanceAudio } from "resonance-audio";
import { Object3D } from "three";
import AudioNode from "./AudioNode";

/**
 * Class extends Object3D in order to work with the SceneCanvas.
 * The Idea ist to override the positionChange-Methods and change the ResonanceAudio
 * accordingly.
 */

export default class ResAudio extends Object3D implements AudioNode {
  audioContext: AudioContext;
  audioSource: AudioBufferSourceNode;
  source: ResonanceAudio.Source;

  constructor(audioScene: ResonanceAudio, audioContext: AudioContext) {
    super();
    this.audioContext = audioContext;
    this.audioSource = audioContext.createBufferSource();
    this.source = audioScene.createSource({
      position: new Float32Array([0, 1, 3]),
      forward: new Float32Array([1, 0, 0])
    });
    this.audioSource.connect(this.source.input);
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);
    this.source.setFromMatrix(this.matrixWorld);
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
