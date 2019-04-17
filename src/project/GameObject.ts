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
import Project from "./Project";

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshLambertMaterial();

export enum InteractionType {
  None = "No interaction",
  CodeBlock = "Code block",
  Teleport = "Teleport",
  PlaySound = "Play sound",
  EndGame = "End game"
}

export interface TeleportTarget {
  roomId: number;
  spawnId: number;
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
  teleportTarget?: TeleportTarget;

  constructor(audioLibrary: AudioLibrary, audioScene: AudioScene) {
    super(cubeGeometry, cubeMaterial);
    this.audioLibrary = audioLibrary;

    this.audio = audioScene.createAudio3D();
    this.add(this.audio);
  }

  triggerInteraction(project: Project): void {
    switch (this.interactionType) {
      case InteractionType.CodeBlock:
        if (this.codeBlock) {
          this.codeBlock.execute(new Map(), new Map(), this);
        }
        break;
      case InteractionType.Teleport:
        if (this.teleportTarget) {
          const { roomId, spawnId } = this.teleportTarget;
          project.teleportPlayer(roomId, spawnId);
        }
        if (this.interactionAudioId != null) {
          this.playSound(this.interactionAudioId);
        }
        break;
      case InteractionType.PlaySound:
        if (this.interactionAudioId != null) {
          this.playSound(this.interactionAudioId);
        }
        break;
      case InteractionType.EndGame:
        if (this.interactionAudioId != null) {
          this.playSound(this.interactionAudioId);
        }
        alert("You have reached the end of this game, congratulations!");
        break;
      default:
        break;
    }
  }

  async playSound(id: number): Promise<void> {
    const audioFile = await this.audioLibrary.get(id);
    if (audioFile) {
      const buffer = await defaultAudioContext.decodeAudioData(
        audioFile.data.slice(0)
      );
    }
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
      id: this.id,
      name: this.name,
      position: this.position.toArray(),
      scale: this.scale.toArray(),
      rotation: this.rotation.toArray().slice(0, 3),
      audioId: this.audioId,
      interactionType: this.interactionType,
      interactionAudioId: this.interactionAudioId,
      codeBlockSource: this.codeBlock && this.codeBlock.source,
      teleportTarget: this.teleportTarget
    };
  }

  fromData(data: SerializedData): this {
    this.id = data.id != null ? data.id : this.id;
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
    this.teleportTarget = data.teleportTarget;

    return this;
  }
}
