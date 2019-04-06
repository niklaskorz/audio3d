/**
 * @author Niklas Korz
 */
import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  AudioListener,
  PositionalAudio
} from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import AudioLibrary, { AudioFile } from "./AudioLibrary";

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshLambertMaterial();

export default class GameObject extends Mesh implements Serializable {
  audioLibrary: AudioLibrary;
  audioId: number | null = null;
  audioFile: AudioFile | null = null;

  audioContext: AudioContext;
  listener: AudioListener;
  audio: PositionalAudio;

  constructor(
    audioLibrary: AudioLibrary,
    audioContext: AudioContext,
    listener: AudioListener
  ) {
    super(cubeGeometry, cubeMaterial);
    this.audioLibrary = audioLibrary;
    this.audioContext = audioContext;
    this.listener = listener;
    this.audio = new PositionalAudio(listener);
    this.add(this.audio);
  }

  async loadAudio(id: number): Promise<void> {
    this.audioId = id;
    this.audioFile = this.audioLibrary.get(id) || null;
    if (this.audioFile) {
      const buffer = await this.audioContext.decodeAudioData(
        this.audioFile.data.slice(0)
      );
      if (this.audio.buffer) {
        this.audio.stop();
      }
      this.audio.setBuffer(buffer);
      this.audio.setLoop(true);
      this.audio.play();
    }
  }

  toData(): SerializedData {
    return {
      name: this.name,
      position: this.position.toArray(),
      scale: this.scale.toArray(),
      rotation: this.rotation.toArray(),
      audioId: this.audioId
    };
  }

  fromData(data: SerializedData): this {
    this.name = data.name;
    this.position.set(data.position[0], data.position[1], data.position[2]);
    this.scale.set(data.scale[0], data.scale[1], data.scale[2]);
    this.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);

    if (data.audioId != null) {
      this.loadAudio(data.audioId);
    }

    return this;
  }
}
