/**
 * @author Niklas Korz
 */
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { Euler, Vector3 } from "three";
import { AudioFile } from "../data/schema";
import { InteractionType, TeleportTarget } from "../project/GameObject";

export interface AudioEntry extends AudioFile {
  id: number;
}

export interface EditorRoom {
  id: number;
  uuid: string;
  name: string;
  dimensions: RoomDimensions;
  materials: RoomMaterials;
}

export interface EditorSpawn {
  id: number;
  uuid: string;
  name: string;
  position: Vector3;
  rotation: number; // Y axis
}

export interface EditorObject {
  id: number;
  uuid: string;
  name: string;
  volume: number;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
  interactionType: InteractionType;
  interactionAudio?: AudioEntry;
  audio?: AudioEntry;
  codeBlockSource?: string;
  teleportTarget?: TeleportTarget;
}
