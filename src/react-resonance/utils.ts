import { RoomDimensions, RoomMaterials } from "resonance-audio";

export type Triple<T> = [T, T, T];
export type Vector3 = Triple<number> | Float32Array;

export const isEqualVector3 = (a?: Vector3, b?: Vector3): boolean =>
  a === b ||
  (a != null && b != null && a[0] === b[0] && a[1] === b[1] && a[2] === b[2]);

export const isEqualRoomDimensions = (
  a?: RoomDimensions,
  b?: RoomDimensions
): boolean =>
  a === b ||
  (a != null &&
    b != null &&
    a.width === b.width &&
    a.height === b.height &&
    a.depth === b.depth);

export const isEqualRoomMaterials = (
  a?: RoomMaterials,
  b?: RoomMaterials
): boolean =>
  a === b ||
  (a != null &&
    b != null &&
    a.left === b.left &&
    a.right === b.right &&
    a.front === b.front &&
    a.back === b.back &&
    a.up === b.up &&
    a.down === b.down);
