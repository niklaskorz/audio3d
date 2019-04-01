/**
 * @author Niklas Korz
 */
import { RoomDimensions } from "resonance-audio";
import { AmbientLight, GridHelper, Object3D, PointLight, Scene } from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import GameObject from "./GameObject";

// A "room" is analog to levels of a game.
// The user will only hear sounds that are part of the current room.
// Also, this abstraction is necessary to support Resonance Audio as one of many
// spatial audio implementations.
export default class Room extends Scene implements Serializable {
  grid: GridHelper;

  get dimensions(): RoomDimensions {
    return this.roomDimensions;
  }

  set dimensions(dimensions: RoomDimensions) {
    this.roomDimensions = dimensions;

    this.remove(this.grid);

    const gridSize = Math.max(dimensions.width, dimensions.depth);
    this.grid = new GridHelper(gridSize, gridSize, 0xffffff, 0xffffff);

    this.add(this.grid);
  }

  constructor(
    name: string = "",
    private roomDimensions: RoomDimensions = { width: 1, height: 1, depth: 1 }
  ) {
    super();

    this.name = name;

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.add(ambientLight);
    const light = new PointLight(0xffffff, 0.5);
    light.position.set(5, 5, 0);
    light.lookAt(0, 0, 0);
    this.add(light);

    const gridSize = Math.max(roomDimensions.width, roomDimensions.depth);
    this.grid = new GridHelper(gridSize, gridSize, 0xffffff, 0xffffff);

    this.add(this.grid);

    this.addCube();
  }

  addCube(): void {
    const cube = new GameObject();
    cube.position.y += 0.5;
    cube.name = "New cube";

    this.add(cube);
    // this.selectMesh(cube);
  }

  toData(): SerializedData {
    return {
      name: this.name,
      dimensions: this.dimensions,
      objects: this.children
        .filter((c: Object3D): c is GameObject => c instanceof GameObject)
        .map(go => go.toData())
    };
  }

  fromData(data: SerializedData): this {
    this.name = data.name;
    this.dimensions = data.dimensions;

    const gameObjects = data.objects.map((o: SerializedData) =>
      new GameObject().fromData(o)
    );
    this.add(...gameObjects);

    return this;
  }
}
