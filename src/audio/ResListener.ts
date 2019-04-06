/**
 * @author Leon Erath / https://leonerath.de/
 */

import { ResonanceAudio } from "resonance-audio";
import { Object3D } from "three";

export default class ResListener extends Object3D {
  audioScene: ResonanceAudio;

  constructor(audioScene: ResonanceAudio) {
    super();
    this.audioScene = audioScene;
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);
    this.audioScene.setListenerFromMatrix(this.matrixWorld);
  }
}
