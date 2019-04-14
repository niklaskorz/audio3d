/**
 * @author Niklas Korz
 */
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { Euler, Vector3 } from "three";
import { AudioFile } from "../data/schema";
import { InteractionType } from "../project/GameObject";

export interface AudioEntry extends AudioFile {
  id: number;
}

export interface EditorRoom {
  id: number;
  name: string;
  dimensions: RoomDimensions;
  materials: RoomMaterials;
}

export interface EditorObject {
  id: number;
  name: string;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
  interactionType: InteractionType;
  interactionAudio?: AudioEntry;
  audio?: AudioEntry;
  codeBlockSource?: string;
}
