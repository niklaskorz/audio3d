/**
 * @author Niklas Korz
 */
import {
  BackSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Vector3
} from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import AudioLibrary from "./AudioLibrary";
import GameObject from "./GameObject";
import Room from "./Room";

export interface ProjectEvents {
  onSelect(object: GameObject | null): void;
  onTranslate(position: Vector3): void;
  onScale(scale: Vector3): void;
}

const noop = (): void => {
  /* noop */
};
const defaultEvents: ProjectEvents = {
  onSelect: noop,
  onScale: noop,
  onTranslate: noop
};

export default class Project implements Serializable {
  events: ProjectEvents;
  audioLibrary = new AudioLibrary();

  id: number | null = null;
  name = "New project";

  rooms: Room[] = [];
  audioType: number = 1;

  activeRoom: Room;
  activeObject: GameObject | null = null;

  outlineMesh = new Mesh();

  get camera(): PerspectiveCamera {
    return this.activeRoom.camera;
  }

  constructor(events: ProjectEvents = defaultEvents) {
    this.events = events;

    const firstRoom = new Room(this.audioLibrary, "First room");
    firstRoom.addCube();
    this.rooms.push(firstRoom);
    this.activeRoom = firstRoom;

    this.outlineMesh.material = new MeshBasicMaterial({
      color: 0xffffff,
      side: BackSide
    });
    this.outlineMesh.scale.multiplyScalar(1.05);
  }

  selectRoom(room: Room): void {
    room.camera.aspect = this.activeRoom.camera.aspect;
    room.camera.updateProjectionMatrix();
    this.activeRoom = room;
    this.selectObject(null);
  }

  selectObject(o: GameObject | null): void {
    if (this.activeObject) {
      this.activeObject.remove(this.outlineMesh);
    }

    if (o) {
      this.outlineMesh.geometry = o.geometry;
      o.add(this.outlineMesh);
    }

    this.activeObject = o;
    this.events.onSelect(o);
  }

  // Serialize instance to a plain JavaScript object
  toData(): SerializedData {
    return {
      name: this.name,
      rooms: this.rooms.map(r => r.toData())
    };
  }

  // Load data from a plain JavaScript object into this instance
  fromData(data: SerializedData): this {
    this.name = data.name;
    this.rooms = data.rooms.map((r: SerializedData) =>
      new Room(this.audioLibrary).fromData(r)
    );
    this.activeRoom = this.rooms[0];

    return this;
  }
}
