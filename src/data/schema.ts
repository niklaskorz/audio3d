/**
 * @author Niklas Korz
 * Schema and data types used for importing, exporting, loading and saving projects
 */
import { DBSchema } from "idb";
import { RoomDimensions, RoomMaterials } from "resonance-audio";

export interface ObjectData {
  name: string;
  position: number[];
  scale: number[];
  rotation: number[];
  audioId?: number;
}

export interface RoomData {
  name: string;
  dimensions: RoomDimensions;
  materials: RoomMaterials;
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
