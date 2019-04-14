/**
 * @author Niklas Korz
 */
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import { ObjectData, AudioFile } from "../data/schema";
import AudioScene from "../audio/AudioScene";
import Audio3D from "../audio/Audio3D";
import defaultAudioContext from "../audio/defaultAudioContext";
import AudioLibrary from "./AudioLibrary";
import CodeBlock from "./CodeBlock";

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshLambertMaterial();

export enum InteractionType {
  None = "No interaction",
  CodeBlock = "Code block",
  Teleport = "Teleport",
  PlaySound = "Play sound",
  EndGame = "End game"
}

export default class GameObject extends Mesh implements Serializable {
  audioLibrary: AudioLibrary;
  audioId?: number;
  audioFile?: AudioFile;

  audio: Audio3D;

  // Interaction specific
  interactionType = InteractionType.None;
  interactionAudioId?: number;
  codeBlock?: CodeBlock;

  constructor(audioLibrary: AudioLibrary, audioScene: AudioScene) {
    super(cubeGeometry, cubeMaterial);
    this.audioLibrary = audioLibrary;

    this.audio = audioScene.createAudio3D();
    this.add(this.audio);
  }

  async loadAudio(id: number): Promise<void> {
    this.audioId = id;
    this.audioFile = await this.audioLibrary.get(id);
    this.audio.stop();
    if (this.audioFile) {
      const buffer = await defaultAudioContext.decodeAudioData(
        this.audioFile.data.slice(0)
      );
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

    this.interactionType = data.interactionType || InteractionType.None;
    this.interactionAudioId = data.interactionAudioId;
    if (data.codeBlockSource) {
      this.codeBlock = new CodeBlock(data.codeBlockSource);
    }

    return this;
  }
}
