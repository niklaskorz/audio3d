/**
 * @author Niklas Korz
 * Schema and data types used for importing, exporting, loading and saving projects
 */
import { DBSchema } from "idb";
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { InteractionType, TeleportTarget } from "../project/GameObject";

export interface ObjectData {
  id: number;
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
  id: number;
  name: string;
  position: number[];
  rotation: number;
}

export interface RoomData {
  id: number;
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
