/**
 * @author Niklas Korz
 */
import { RoomDimensions } from "resonance-audio";
import {
  AmbientLight,
  BackSide,
  BoxGeometry,
  GridHelper,
  Group,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3
} from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import AudioLibrary from "./AudioLibrary";
import GameObject from "./GameObject";

const wallGeometry = new BoxGeometry(1, 1, 1);
const wallMaterial = new MeshLambertMaterial();

// A "room" is analog to levels of a game.
// The user will only hear sounds that are part of the current room.
// Also, this abstraction is necessary to support Resonance Audio as one of many
// spatial audio implementations.
export default class Room extends Scene implements Serializable {
  grid: GridHelper;
  wallNorth = new Mesh(wallGeometry, wallMaterial);
  wallEast = new Mesh(wallGeometry, wallMaterial);
  wallSouth = new Mesh(wallGeometry, wallMaterial);
  wallWest = new Mesh(wallGeometry, wallMaterial);
  camera = new PerspectiveCamera(60, 1, 0.1, 1000);

  get dimensions(): RoomDimensions {
    return this.roomDimensions;
  }

  set dimensions(dimensions: RoomDimensions) {
    this.roomDimensions = dimensions;

    this.remove(this.grid);

    const gridSize = Math.max(dimensions.width, dimensions.depth);
    this.grid = new GridHelper(gridSize, gridSize, 0xffffff, 0xffffff);

    this.add(this.grid);

    this.updateWalls();
  }

  constructor(
    private audioLibrary: AudioLibrary,
    name: string = "",
    private roomDimensions: RoomDimensions = { width: 15, depth: 15, height: 3 }
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

    this.updateWalls();
    this.add(this.wallNorth);
    this.add(this.wallEast);
    this.add(this.wallSouth);
    this.add(this.wallWest);

    this.camera.position.z = 3;
    this.camera.position.y = 3;
    this.camera.lookAt(new Vector3(0, 0.5, 0));
  }

  addCube(): GameObject {
    const cube = new GameObject(this.audioLibrary);
    cube.position.y += 0.5;
    cube.name = "New cube";

    this.add(cube);
    return cube;
  }

  updateWalls(): void {
    const { width, depth, height } = this.roomDimensions;

    this.wallNorth.scale.set(width, height, 0.25);
    this.wallEast.scale.set(0.25, height, depth);
    this.wallSouth.scale.set(width, height, 0.25);
    this.wallWest.scale.set(0.25, height, depth);

    this.wallNorth.position.set(0, height / 2, depth / 2);
    this.wallEast.position.set(width / 2, height / 2, 0);
    this.wallSouth.position.set(0, height / 2, -depth / 2);
    this.wallWest.position.set(-width / 2, height / 2, 0);
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
      new GameObject(this.audioLibrary).fromData(o)
    );
    this.add(...gameObjects);

    return this;
  }
}
