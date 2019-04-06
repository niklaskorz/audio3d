/**
 * @author Leon Erath / https://leonerath.de/
 */

import { ResonanceAudio } from "resonance-audio";
import { Object3D, Quaternion, Vector3 } from "three";

export default class Listener extends Object3D {
  audioScene: ResonanceAudio;

  constructor(audioScene: ResonanceAudio) {
    super();
    this.audioScene = audioScene;
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);

    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const orientation = new Vector3();

    this.matrixWorld.decompose(position, quaternion, scale);

    orientation.set(0, 0, -1).applyQuaternion(quaternion);

    this.audioScene.setListenerPosition(position.x, position.y, position.z);
    this.audioScene.setListenerOrientation(
      orientation.x,
      orientation.y,
      orientation.z,
      this.up.x,
      this.up.y,
      this.up.z
    );
  }
}
