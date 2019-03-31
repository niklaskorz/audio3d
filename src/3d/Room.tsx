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
  grid = new GridHelper(10, 10, 0xffffff, 0xffffff);
  cubeGeometry = new BoxGeometry(1, 1, 1);
  cubeMaterial = new MeshLambertMaterial();

  constructor() {
    super();

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.add(ambientLight);
    const light = new PointLight(0xffffff, 0.5);
    light.position.set(5, 5, 0);
    light.lookAt(0, 0, 0);
    this.add(light);

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
