/**
 * @author Leon Erath / https://leonerath.de/
 */

import { ResonanceAudio } from "resonance-audio";
import { Object3D, Vector3, Quaternion } from "three";

/**
 * Class extends Object3D in order to work with the SceneCanvas.
 * The Idea ist to override the positionChange-Methods and change the ResonanceAudio
 * accordingly.
 */

export default class ResAudio extends Object3D {
  constructor() {
    super();
    this.audioContext = new AudioContext();
    this.scene = new ResonanceAudio(this.audioContext);
    this.scene.output.connect(this.audioContext.destination);
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.loop = true;
    this.source = this.scene.createSource({
      position: new Float32Array([0, 1, 3]),
      forward: new Float32Array([1, 0, 0])
    });
    this.audioSource.connect(this.source.input);
    this.isPlaying = false;
  }

  updateMatrixWorld(force) {
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const orientation = new Vector3();

    Object3D.prototype.updateMatrixWorld.call(this, force);

    this.matrixWorld.decompose(position, quaternion, scale);

    console.log(position.x, position.y, position.z);

    orientation.set(0, 0, 1).applyQuaternion(quaternion);

    this.source.setPosition(position.x, position.y, position.z);
    this.source.setOrientation(orientation.x, orientation.y, orientation.z);
  }

  async play(src) {
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

  pause() {
    this.audioSource.stop();
    this.isPlaying = false;
  }

  stop() {
    this.audioSource.stop();
    this.isPlaying = false;
    this.audioSource.buffer = null;
  }
}
