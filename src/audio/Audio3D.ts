/**
 * @author Niklas Korz
 * @author Leon Erath
 */
import { Object3D, Vector3, Quaternion } from "three";
import { ResonanceAudio } from "resonance-audio";
import BinauralSource from "./binaural/BinauralSource";

/**
 * Class extends Object3D in order to work with the three.js scene graph.
 * The idea is to override the updateWorldMatrix method and change the audio nodes
 * accordingly.
 */
export default class Audio3D extends Object3D {
  webAudioContext: AudioContext;
  binauralAudioContext: AudioContext;
  resonanceAudioContext: AudioContext;

  webAudioPannerNode: PannerNode;
  binauralSource: BinauralSource;
  resonanceSource: ResonanceAudio.Source;

  webAudioGainNode: GainNode;
  binauralGainNode: GainNode;
  resonanceGainNode: GainNode;

  webAudioBufferSource: AudioBufferSourceNode;
  binauralBufferSource: AudioBufferSourceNode;
  resonanceBufferSource: AudioBufferSourceNode;

  hasStarted = false;
  isPlaying = false;

  constructor(
    webAudioContext: AudioContext,
    binauralAudioContext: AudioContext,
    resonanceAudioContext: AudioContext,
    webAudioPannerNode: PannerNode,
    binauralSource: BinauralSource,
    resonanceSource: ResonanceAudio.Source
  ) {
    super();

    this.webAudioContext = webAudioContext;
    this.binauralAudioContext = binauralAudioContext;
    this.resonanceAudioContext = resonanceAudioContext;

    this.webAudioGainNode = webAudioContext.createGain();
    this.binauralGainNode = binauralAudioContext.createGain();
    this.resonanceGainNode = resonanceAudioContext.createGain();

    this.webAudioGainNode.connect(webAudioContext.destination);
    this.binauralGainNode.connect(binauralAudioContext.destination);
    this.resonanceGainNode.connect(resonanceAudioContext.destination);

    this.webAudioPannerNode = webAudioPannerNode;
    this.binauralSource = binauralSource;
    this.resonanceSource = resonanceSource;

    this.webAudioBufferSource = webAudioContext.createBufferSource();
    this.binauralBufferSource = binauralAudioContext.createBufferSource();
    this.resonanceBufferSource = resonanceAudioContext.createBufferSource();

    this.webAudioBufferSource.connect(webAudioPannerNode);
    this.binauralBufferSource.connect(binauralSource.input);
    this.resonanceBufferSource.connect(resonanceSource.input);

    this.webAudioBufferSource.connect(this.webAudioGainNode);
    this.binauralBufferSource.connect(this.binauralGainNode);
    this.resonanceBufferSource.connect(this.resonanceGainNode);

    this.webAudioPannerNode.connect(webAudioContext.destination);

    this.webAudioBufferSource.onended = this.onAudioEnded;

  }

  setVolume(volume: number): void {
    if (volume >= 0 && volume <= 2) {
      this.webAudioGainNode.gain.value = volume;
      this.binauralGainNode.gain.value = volume;
      this.resonanceGainNode.gain.value = volume;
    }
  }

  setDistanceModel(distanceModel: DistanceModel): void {
    this.webAudioPannerNode.distanceModel = distanceModel;
    this.binauralBufferSource.onended = this.onAudioEnded;
    this.resonanceBufferSource.onended = this.onAudioEnded;

  }

  updateMatrixWorld(force: boolean): void {
    super.updateMatrixWorld(force);

    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    this.matrixWorld.decompose(position, quaternion, scale);
    const orientation = new Vector3(0, 0, 1).applyQuaternion(quaternion);

    this.webAudioPannerNode.setPosition(position.x, position.y, position.z);
    this.webAudioPannerNode.setOrientation(
      orientation.x,
      orientation.y,
      orientation.z
    );

    this.binauralSource.position.copy(position);
    this.binauralSource.orientation.copy(orientation);
    this.binauralSource.update();

    // Resonance Audio already works with matrices similar to three.js internally.
    this.resonanceSource.setFromMatrix(this.matrixWorld);
  }

  onAudioEnded = () => {
    this.stopAll();
    this.isPlaying = false;
  };

  setBuffer(buffer: AudioBuffer): void {
    if (this.webAudioBufferSource.buffer) {
      // Chrome does not allow "resetting" the buffer and throws an error
      // with this message: Cannot set buffer to non-null after it has been already been set to a non-null buffer
      // To circumvent this, we have to create a new buffer source

      this.stop();

      this.webAudioBufferSource = this.webAudioContext.createBufferSource();
      this.binauralBufferSource = this.binauralAudioContext.createBufferSource();
      this.resonanceBufferSource = this.resonanceAudioContext.createBufferSource();

      this.webAudioBufferSource.connect(this.webAudioPannerNode);
      this.binauralBufferSource.connect(this.binauralSource.input);
      this.resonanceBufferSource.connect(this.resonanceSource.input);

      this.webAudioBufferSource.onended = this.onAudioEnded;
      this.binauralBufferSource.onended = this.onAudioEnded;
      this.resonanceBufferSource.onended = this.onAudioEnded;
    }

    this.webAudioBufferSource.buffer = buffer;
    this.binauralBufferSource.buffer = buffer;
    this.resonanceBufferSource.buffer = buffer;

    this.hasStarted = false;
    this.isPlaying = false;
  }

  setLoop(loop: boolean): void {
    this.webAudioBufferSource.loop = loop;
    this.binauralBufferSource.loop = loop;
    this.resonanceBufferSource.loop = loop;
  }

  play(): void {
    if (this.webAudioBufferSource.buffer) {
      if (this.hasStarted) {
        // A buffer source node can only be played once, unfortunately.
        // We have to "reset" the node by creating a new one and reusing the buffer.
        this.setBuffer(this.webAudioBufferSource.buffer);
      }

      this.webAudioBufferSource.start();
      this.binauralBufferSource.start();
      this.resonanceBufferSource.start();

      this.hasStarted = true;
      this.isPlaying = true;
    }
  }

  stop(): void {
    this.isPlaying = false;
    if (this.hasStarted) {
      this.stopAll();
    }
  }

  stopAll(): void {
    try {
      this.webAudioBufferSource.stop();
      this.binauralBufferSource.stop();
      this.resonanceBufferSource.stop();

      this.webAudioBufferSource.disconnect();
      this.binauralBufferSource.disconnect();
      this.resonanceBufferSource.disconnect();
    } catch (ex) {
      console.log("Audio could not be stopped:", ex);
    }
  }
}
