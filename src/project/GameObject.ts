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
  PlaySound = "Play sound",
  Teleport = "Teleport",
  CodeBlock = "Code block"
}

export interface TeleportTarget {
  roomId: string;
  spawnId: string;
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

  get volume(): number {
    return this.audio.volume;
  }

  set volume(volume: number) {
    this.audio.volume = volume;
  }

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
          this.codeBlock.execute(this, project, project.activeRoom.roomState);
        }
        break;
      case InteractionType.Teleport:
        if (this.teleportTarget) {
          const { roomId, spawnId } = this.teleportTarget;
          project.teleportPlayer(roomId, spawnId);
        }
        if (this.interactionAudioId != null) {
          this.playAudio(this.interactionAudioId);
        }
        break;
      case InteractionType.PlaySound:
        if (this.interactionAudioId != null) {
          this.playAudio(this.interactionAudioId);
        }
        break;
      default:
        break;
    }
  }

  async playAudio(id: number, loop: boolean = false): Promise<void> {
    this.audioId = id;
    this.audioFile = await this.audioLibrary.get(id);
    if (this.audioFile) {
      const buffer = await defaultAudioContext.decodeAudioData(
        this.audioFile.data.slice(0)
      );
      this.audio.setBuffer(buffer);
      this.audio.setLoop(loop);

      this.audio.play();
    } else {
      console.log(
        "Audio with id",
        id,
        "could not be found and can't be played"
      );
    }
  }

  toData(): ObjectData {
    return {
      uuid: this.uuid,
      name: this.name,
      volume: this.volume,
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
    this.uuid = data.uuid != null ? data.uuid : this.uuid;
    this.name = data.name;
    this.position.set(data.position[0], data.position[1], data.position[2]);
    this.scale.set(data.scale[0], data.scale[1], data.scale[2]);
    this.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);

    if (data.audioId != null) {
      this.playAudio(data.audioId, true);
    }

    if (data.volume != null) {
      this.volume = data.volume;
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
