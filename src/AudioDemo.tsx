import {
  ResonanceAudio,
  RoomDimensions,
  RoomMaterials,
  Source
} from "resonance-audio";
import { Vector3 } from "three";

const dimensions: RoomDimensions = {
  width: 8,
  height: 4,
  depth: 8
};

const materials: RoomMaterials = {
  left: "brick-bare",
  right: "curtain-heavy",
  front: "marble",
  back: "glass-thin",
  down: "grass",
  up: "transparent"
};

// Circular position based on timestamp
const f = (t: number): Vector3 =>
  new Vector3(
    3 * Math.sin((t / 4000) * 2 * Math.PI),
    1,
    3 * Math.cos((t / 4000) * 2 * Math.PI)
  );

export default class AudioDemo {
  audioContext: AudioContext;
  scene: ResonanceAudio;
  audioSource: AudioBufferSourceNode;
  source: Source;

  lastT = 0;
  raf = 0;

  constructor() {
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
  }

  async start(src: string): Promise<void> {
    const resp = await fetch(src);
    const data = await resp.arrayBuffer();
    const buffer = await this.audioContext.decodeAudioData(data);

    this.audioSource.buffer = buffer;
    this.audioSource.start();

    this.raf = requestAnimationFrame(this.update);
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
    this.audioSource.stop();
    this.audioSource.buffer = null;
  }

  update: FrameRequestCallback = t => {
    const { x, y, z } = f(t);
    this.source.setPosition(x, y, z);
    console.log(x, y, z);

    this.raf = requestAnimationFrame(this.update);
  };
}
