/**
 * @author Leon Erath / https://leonerath.de/
 */

import { Object3D, Vector3, Quaternion } from "three";
import BinauralFIR, { HRTF } from "binauralfir";
import { radToDeg } from "../../utils/math";
import AudioNode from "../AudioNode";
import BinauralScene from "./BinauralScene";

/**
 * Class extends Object3D in order to work with the SceneCanvas.
 * The Idea ist to override the positionChange-Methods and change the ResonanceAudio
 * accordingly.
 */

export default class BinauralListener extends Object3D {
  scene: BinauralScene;

  constructor(scene: BinauralScene) {
    super();
    this.scene = scene;
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);

    const quaternion = new Quaternion();
    const scale = new Vector3();

    this.matrixWorld.decompose(this.scene.listenerPosition, quaternion, scale);

    this.scene.listenerOrientation.set(0, 0, 1).applyQuaternion(quaternion);
    this.scene.update();
  }
}
