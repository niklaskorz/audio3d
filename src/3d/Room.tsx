import { RoomDimensions } from "resonance-audio";
import {
  AmbientLight,
  BoxGeometry,
  GridHelper,
  Mesh,
  MeshLambertMaterial,
  PointLight,
  Scene
} from "three";

export default class Room extends Scene {
  grid: GridHelper;
  cubeGeometry = new BoxGeometry(1, 1, 1);
  cubeMaterial = new MeshLambertMaterial();

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

  constructor(name: string, private roomDimensions: RoomDimensions) {
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
    const cube = new Mesh(this.cubeGeometry, this.cubeMaterial);
    cube.position.y += 0.5;
    cube.name = "New cube";

    this.add(cube);
    // this.selectMesh(cube);
  }
}
