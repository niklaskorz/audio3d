/**
 * @author Niklas Korz
 */
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Serializable, { SerializedData } from "../data/Serializable";

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshLambertMaterial();

export default class GameObject extends Mesh implements Serializable {
  constructor() {
    super(cubeGeometry, cubeMaterial);
  }

  toData(): SerializedData {
    return {
      name: this.name,
      position: this.position.toArray(),
      scale: this.scale.toArray(),
      rotation: this.rotation.toArray()
    };
  }

  fromData(data: SerializedData): this {
    this.name = data.name;
    this.position.set(data.position[0], data.position[1], data.position[2]);
    this.scale.set(data.scale[0], data.scale[1], data.scale[2]);
    this.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);

    return this;
  }
}
