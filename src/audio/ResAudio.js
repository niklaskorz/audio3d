/**
 * @author Leon Erath / https://leonerath.de/
 */

import {
  ResonanceAudio,
  RoomDimensions,
  RoomMaterials,
  Source
} from "resonance-audio";
import { Object3D, Vector3 } from "three";

const f = t =>
  new Vector3(
    3 * Math.sin((t / 4000) * 2 * Math.PI),
    1,
    3 * Math.cos((t / 4000) * 2 * Math.PI)
  );

/**
 * Class extends Object3D in order to work with the SceneCanvas.
 * The Idea ist to override the positionChange-Methods and change the ResonanceAudio
 * accordingly.
 */

export default class ResAudio extends Object3D {
  lastT = 0;
  raf = 0;

  constructor() {
    super();
    this.audioContext = new AudioContext();
    this.scene = new ResonanceAudio(this.audioContext, {
      ambisonicOrder: 3,
      listenerPosition: new Float32Array([0, 1, 0]),
      dimensions,
      materials
    });
    this.scene.output.connect(this.audioContext.destination);
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.loop = true;
    this.source = this.scene.createSource({
      position: new Float32Array([0, 1, 3]),
      forward: new Float32Array([1, 0, 0])
    });
    this.audioSource.connect(this.source.input);
    this.loop = false;
    this.isPlaying = false;
  }

  //example to override
  rotateOnAxis() {}

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
    this.raf = requestAnimationFrame(this.update);
  }

  pause() {
    this.audioSource.stop();
    this.isPlaying = false;
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.audioSource.stop();
    this.audioSource.buffer = null;
  }

  update(t) {
    const { x, y, z } = f(t);
    this.source.setPosition(x, y, z);
    console.log(x, y, z);

    this.raf = requestAnimationFrame(this.update);
  }
}
