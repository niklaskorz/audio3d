/**
 * @author Niklas Korz, Leon Erath
 */
import { Vector3 } from "three";
import BinauralFIR from "binauralfir";
import { radToDeg } from "../../utils/math";
import BinauralScene from "./BinauralScene";

export default class BinauralSource {
  position = new Vector3();
  orientation = new Vector3();
  scene: BinauralScene;
  binauralFIR: BinauralFIR;

  get input(): AudioNode {
    return this.binauralFIR.input;
  }

  constructor(scene: BinauralScene) {
    this.scene = scene;
    this.binauralFIR = new BinauralFIR({ audioContext: scene.audioContext });
    this.binauralFIR.HRTFDataset = scene.hrtfDataset;
    this.binauralFIR.connect(scene.audioContext.destination);
  }

  update(): void {
    const listenerAzimuth = Math.atan2(
      this.scene.listenerOrientation.x,
      this.scene.listenerOrientation.z
    );

    const distance = this.binauralFIR.distance(
      this.position,
      this.scene.listenerPosition
    );

    const deltaZ = this.position.z - this.scene.listenerPosition.z;
    const azimuth = radToDeg(
      listenerAzimuth + deltaZ &&
        Math.atan((this.position.x - this.scene.listenerPosition.x) / deltaZ)
    );

    const elevation =
      distance &&
      radToDeg(
        Math.asin((this.position.y - this.scene.listenerPosition.y) / distance)
      );

    this.binauralFIR.setPosition(azimuth, elevation, distance);
  }
}
