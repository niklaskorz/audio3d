/**
 * @author Leon Erath / https://leonerath.de/
 */

import { ResonanceAudio } from "resonance-audio";
import { Object3D, Quaternion, Vector3 } from "three";

/**
 * Class extends Object3D in order to work with the SceneCanvas.
 * The Idea ist to override the positionChange-Methods and change the ResonanceAudio
 * accordingly.
 */

export default class ResAudio extends Object3D {
  audioContext: AudioContext;

  audioSource: AudioBufferSourceNode;
  source: ResonanceAudio.Source;
  isPlaying: boolean;

  constructor(audioScene: ResonanceAudio, audioContext: AudioContext) {
    super();
    this.audioContext = audioContext;
    this.audioSource = audioContext.createBufferSource();
    this.audioSource.loop = true;
    this.source = audioScene.createSource({
      position: new Float32Array([0, 1, 3]),
      forward: new Float32Array([1, 0, 0])
    });
    this.audioSource.connect(this.source.input);
    this.isPlaying = false;
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);

    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const orientation = new Vector3();

    this.matrixWorld.decompose(position, quaternion, scale);

    console.log(position.x, position.y, position.z);

    orientation.set(0, 0, 1).applyQuaternion(quaternion);

    this.source.setPosition(position.x, position.y, position.z);
    this.source.setOrientation(
      orientation.x,
      orientation.y,
      orientation.z,
      this.up.x,
      this.up.y,
      this.up.z
    );
  }

  async play(src: string): Promise<void> {
    if (this.isPlaying === true) {
      console.warn("ResAudio: Audio is already playing.");
      return;
    }
    const resp = await fetch(src);
    const data = await resp.arrayBuffer();
    const buffer = await this.audioContext.decodeAudioData(data);

    this.audioSource.buffer = buffer;
    this.audioSource.start();
    this.isPlaying = true;
  }

  pause(): void {
    this.audioSource.stop();
    this.isPlaying = false;
  }

  stop(): void {
    this.audioSource.stop();
    this.isPlaying = false;
    this.audioSource.buffer = null;
  }
}
