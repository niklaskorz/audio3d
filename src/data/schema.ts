/**
 * @author Niklas Korz
 * Schema and data types used for importing, exporting, loading and saving projects
 */
import { DBSchema } from "idb";
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { InteractionType, TeleportTarget } from "../project/GameObject";
import AudioImplementation from "../audio/AudioImplementation";

export interface ObjectData {
  uuid: string;
  name: string;
  position: number[];
  scale: number[];
  rotation: number[];
  audioId?: number;
  interactionType: InteractionType;
  interactionAudioId?: number;
  codeBlockSource?: string;
  teleportTarget?: TeleportTarget;
}

export interface SpawnData {
  uuid: string;
  name: string;
  position: number[];
  rotation: number;
}

export interface RoomData {
  uuid: string;
  name: string;
  dimensions: RoomDimensions;
  materials: RoomMaterials;
  spawns: SpawnData[];
  objects: ObjectData[];
}

export interface ProjectData {
  id?: number;
  name: string;
  rooms: RoomData[];
  savedAt: Date;
  nextAudioId: number; // Used for generating keys for new audio files

  audioImplementation?: AudioImplementation;

  panningModel?: PanningModelType;
  distanceModel?: DistanceModelType;
  ambisonicOrder?: number;
  rollofModel?: string;

  collisionAudioId?: number;
  footstepAudioId?: number;
  interactAvailAudioId?: number;
}

export interface AudioFile {
  name: string;
  type: string;
  data: ArrayBuffer;
}

export interface AudioWithIds extends AudioFile {
  projectId: number;
  audioId: number;
}

export interface Schema extends DBSchema {
  projects: {
    key: number;
    value: ProjectData;
    indexes: {
      savedAt: Date;
    };
  };
  audios: {
    key: [number, number];
    value: AudioWithIds;
    indexes: {
      project: number;
    };
  };
}
