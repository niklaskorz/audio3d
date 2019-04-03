/**
 * @author Leon Erath / https://leonerath.de/
 */

import { ResonanceAudio } from "resonance-audio";
import { Object3D, Vector3, Quaternion } from "three";

export default class Listener extends Object3D {
  constructor(room) {
    this.room = room;
  }

  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);

    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const orientation = new Vector3();

    this.matrixWorld.decompose(position, quaternion, scale);

    orientation.set(0, 0, 1).applyQuaternion(quaternion);

    this.room.setListenerPosition(position.x, position.y, position.z);
    this.room.setListenerOrientation(
      orientation.x,
      orientation.y,
      orientation.z
    );
  }
}
