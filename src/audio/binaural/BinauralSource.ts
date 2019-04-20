/**
 * @author Niklas Korz
 * @author Leon Erath
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
    // The distance calculation is straightforward as BinauralFIR already provides
    // a utility function.
    const distance = this.binauralFIR.distance(
      this.position,
      this.scene.listenerPosition
    );

    // The azimuth is the horizontal angle between the listener and the audio source.
    // It ranges from -180 to +180, where +-180 is directly behind, 0 directly in front,
    // -90 on the left and +90 on the right.
    const azimuth = Math.atan2(
      this.position.x - this.scene.listenerPosition.x,
      // The three.js z-axis is negative on the front and positive on the back of the listener,
      // so we have to invert it to match the mathematical unit circle.
      -(this.position.z - this.scene.listenerPosition.z)
    );

    // We also have to take the listener's rotation into consideration.
    // I.e., we take the listener orientation to calculate the total rotation instead
    // of the Euler angles.
    // The result is the inverted angle.
    const listenerAzimuth = Math.atan2(
      this.scene.listenerOrientation.x,
      // The three.js z-axis is negative on the front and positive on the back of the listener,
      // so we have to invert it to match the mathematical unit circle.
      this.scene.listenerOrientation.z
    );

    // The elevation is the vertical angle between the listener and the audio source.
    // It ranges from -90 to +90, where -90 is directly below and +90 directly above.
    // An angle of zero means both the listener and the audio source are on the same
    // horizontal plane.
    // For a better mental model, we imagine the vector between the two points to be
    // two dimensional. I.e., we use the y axis for the second component and create
    // an artificial axis for the first component out of the x- and z- coordinates.
    // This first component equals the length of the two-dimensional vector on the
    // axes x and z and can therefore be simply calculated with the Pythagoras theorem.
    // Then, we can use atan2 as in the previous two cases for calculating the vertical angle.
    const elevation = Math.atan2(
      this.position.y - this.scene.listenerPosition.y,
      Math.sqrt(
        this.position.x -
          this.scene.listenerPosition.x +
          -(this.position.z - this.scene.listenerPosition.z)
      )
    );

    this.binauralFIR.setPosition(
      // BinauralFIR expects degrees instead of radians
      radToDeg(azimuth + listenerAzimuth),
      radToDeg(elevation),
      distance
    );
  }
}
