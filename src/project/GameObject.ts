/**
 * @author Niklas Korz
 */
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import { ResonanceAudio } from "resonance-audio";
import Serializable, { SerializedData } from "../data/Serializable";
import ResAudio from "../audio/ResAudio";
import { ObjectData, AudioFile } from "../data/schema";
import AudioLibrary from "./AudioLibrary";

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshLambertMaterial();

export default class GameObject extends Mesh implements Serializable {
  audioLibrary: AudioLibrary;
  audioId?: number;
  audioFile?: AudioFile;

  audioContext: AudioContext;
  audioScene: ResonanceAudio;
  audio: ResAudio;

  constructor(
    audioLibrary: AudioLibrary,
    audioContext: AudioContext,
    audioScene: ResonanceAudio
  ) {
    super(cubeGeometry, cubeMaterial);
    this.audioLibrary = audioLibrary;
    this.audioContext = audioContext;
    this.audioScene = audioScene;
    this.audio = new ResAudio(audioScene, audioContext);
    this.add(this.audio);
  }

  async loadAudio(id: number): Promise<void> {
    this.audioId = id;
    this.audioFile = await this.audioLibrary.get(id);
    if (this.audioFile) {
      const buffer = await this.audioContext.decodeAudioData(
        this.audioFile.data.slice(0)
      );
      this.audio.stop();
      this.audio.setBuffer(buffer);
      this.audio.setLoop(true);
      this.audio.play();
    }
  }

  toData(): ObjectData {
    return {
      name: this.name,
      position: this.position.toArray(),
      scale: this.scale.toArray(),
      rotation: this.rotation.toArray().slice(0, 3),
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
