/**
 * @author Niklas Korz
 */
import { Vector3 } from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import AudioLibrary from "./AudioLibrary";
import GameObject from "./GameObject";
import Room from "./Room";

export interface ProjectEvents {
  onSelect(object: GameObject | null): void;
  onTranslate(position: Vector3): void;
  onScale(scale: Vector3): void;
}

const noop = () => {
  /* noop */
};
const defaultEvents: ProjectEvents = {
  onSelect: noop,
  onScale: noop,
  onTranslate: noop
};

export default class Project implements Serializable {
  audioLibrary = new AudioLibrary();

  id: number | null = null;
  name = "New project";

  rooms: Room[] = [];
  audioType: number = 1;

  activeRoom: Room;
  activeObject: GameObject | null = null;

  constructor(public events: ProjectEvents = defaultEvents) {
    const firstRoom = new Room(this.audioLibrary, "First room", {
      width: 15,
      depth: 10,
      height: 3
    });
    firstRoom.addCube();
    this.rooms.push(firstRoom);
    this.activeRoom = firstRoom;
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
