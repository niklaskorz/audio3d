/**
 * @author Niklas Korz
 * @author Leon Erath
 */
import { Object3D, Vector3, Quaternion } from "three";
import { ResonanceAudio } from "resonance-audio";
import BinauralScene from "./binaural/BinauralScene";

export default class Listener3D extends Object3D {
  webAudioListener: AudioListener;
  binauralScene: BinauralScene;
  resonanceScene: ResonanceAudio;

  constructor(
    webAudioListener: AudioListener,
    binauralScene: BinauralScene,
    resonanceScene: ResonanceAudio
  ) {
    super();
    this.webAudioListener = webAudioListener;
    this.binauralScene = binauralScene;
    this.resonanceScene = resonanceScene;
  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);

    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    this.matrixWorld.decompose(position, quaternion, scale);
    const orientation = new Vector3(0, 0, 1).applyQuaternion(quaternion);

    this.webAudioListener.setPosition(-position.x, position.y, -position.z);
    this.webAudioListener.setOrientation(
      orientation.x,
      orientation.y,
      orientation.z,
      this.up.x,
      this.up.y,
      this.up.z
    );

    this.binauralScene.listenerPosition.copy(position);
    this.binauralScene.listenerOrientation.copy(orientation);
    this.binauralScene.update();

    this.resonanceScene.setListenerFromMatrix(this.matrixWorld);
  }
}
