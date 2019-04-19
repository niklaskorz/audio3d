/**
 * @author Niklas Korz
 */
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import { SpawnData } from "../data/schema";

const spawnGeometry = new BoxGeometry(1, 0.1, 1);
const spawnMaterial = new MeshLambertMaterial({
  color: 0x00ff00
});

const directionGeometry = new BoxGeometry(0.1, 0.1, 0.5);

export default class SpawnMarker extends Mesh implements Serializable {
  constructor() {
    super(spawnGeometry, spawnMaterial);
    this.position.set(0, 0.05, 2);

    const directionMarker = new Mesh(directionGeometry, spawnMaterial);
    directionMarker.position.z = -0.5;
    this.add(directionMarker);
  }

  toData(): SpawnData {
    return {
      uuid: this.uuid,
      name: this.name,
      position: [this.position.x, this.position.z],
      rotation: this.rotation.y
    };
  }

  fromData(data: SerializedData): this {
    this.uuid = data.uuid;
    this.name = data.name;
    this.position.set(data.position[0], 0.05, data.position[1]);
    this.rotation.set(0, data.rotation, 0);

    return this;
  }
}
