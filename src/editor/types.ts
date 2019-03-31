import { RoomDimensions } from "resonance-audio";
import { Euler, Vector3 } from "three";

export interface EditorRoom {
  id: number;
  name: string;
  dimensions: RoomDimensions;
}

export interface EditorObject {
  id: number;
  name: string;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
}
