/**
 * @author Niklas Korz
 */
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Serializable, { SerializedData } from "../data/Serializable";
import AudioLibrary from "./AudioLibrary";

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshLambertMaterial();

export default class GameObject extends Mesh implements Serializable {
  audioId: number | null = null;
  audioData: ArrayBuffer | null = null;

  constructor(private audioLibrary: AudioLibrary) {
    super(cubeGeometry, cubeMaterial);
  }

  toData(): SerializedData {
    return {
      name: this.name,
      position: this.position.toArray(),
      scale: this.scale.toArray(),
      rotation: this.rotation.toArray(),
      audioId: this.audioId
    };
  }

  fromData(data: SerializedData): this {
    this.name = data.name;
    this.position.set(data.position[0], data.position[1], data.position[2]);
    this.scale.set(data.scale[0], data.scale[1], data.scale[2]);
    this.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);
    this.audioId = data.audioId;

    if (this.audioId != null) {
      this.audioData = this.audioLibrary.get(this.audioId) || null;
    }

    return this;
  }
}
