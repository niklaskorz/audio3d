/**
 * @author Niklas Korz
 */
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { Euler, Vector3 } from "three";
import { AudioFile } from "../data/schema";

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
  audio?: AudioEntry;
}
