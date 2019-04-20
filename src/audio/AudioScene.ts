/**
 * @author Niklas Korz
 * @author Leon Erath
 */
import { ResonanceAudio, RoomMaterials, RoomDimensions } from "resonance-audio";
import { HRTF } from "binauralfir";
import BinauralScene from "./binaural/BinauralScene";
import Audio3D from "./Audio3D";
import AudioImplementation from "./AudioImplementation";
import Listener3D from "./Listener3D";
import { loadHRTFDataset } from "./binaural/hrtf";

interface Options {
  materials?: RoomMaterials;
  dimensions?: RoomDimensions;
}

export default class AudioScene {
  audioImplementation: AudioImplementation = AudioImplementation.WebAudio;

  webAudioContext = new AudioContext();
  binauralAudioContext = new AudioContext();
  resonanceAudioContext = new AudioContext();

  binauralScene = new BinauralScene(this.binauralAudioContext);
  resonanceScene = new ResonanceAudio(this.resonanceAudioContext);

  binauralHRTFDataset: HRTF[] | null = null;
  isLoadingBinauralHRTFDataset = false;

  listener3D = new Listener3D(
    this.webAudioContext.listener,
    this.binauralScene,
    this.resonanceScene
  );

  constructor(options: Options) {
    this.resonanceScene.setRoomProperties(
      options.dimensions || ResonanceAudio.Utils.DEFAULT_ROOM_DIMENSIONS,
      options.materials || ResonanceAudio.Utils.DEFAULT_ROOM_MATERIALS
    );
    this.resonanceScene.output.connect(this.resonanceAudioContext.destination);
    this.suspend();
  }

  createAudio3D(): Audio3D {
    const audio = new Audio3D(
      this.webAudioContext,
      this.binauralAudioContext,
      this.resonanceAudioContext,
      this.webAudioContext.createPanner(),
      this.binauralScene.createSource(),
      this.resonanceScene.createSource()
    );

    return audio;
  }

  close(): void {
    this.webAudioContext.close();
    this.binauralAudioContext.close();
    this.resonanceAudioContext.close();
  }

  suspend(): void {
    this.webAudioContext.suspend();
    this.binauralAudioContext.suspend();
    this.resonanceAudioContext.suspend();
  }

  resume(): void {
    switch (this.audioImplementation) {
      case AudioImplementation.WebAudio:
        this.webAudioContext.resume();
        break;
      case AudioImplementation.Binaural:
        this.binauralAudioContext.resume();
        break;
      case AudioImplementation.ResonanceAudio:
        this.resonanceAudioContext.resume();
        break;
    }
  }

  selectAudioImplementation(audioImplementation: AudioImplementation): void {
    if (
      audioImplementation === AudioImplementation.Binaural &&
      !this.binauralHRTFDataset &&
      !this.isLoadingBinauralHRTFDataset
    ) {
      this.loadBinauralHRTFDataset();
    }

    this.suspend();
    this.audioImplementation = audioImplementation;
    this.resume();
  }

  async loadBinauralHRTFDataset(): Promise<void> {
    this.isLoadingBinauralHRTFDataset = true;
    try {
      this.binauralHRTFDataset = await loadHRTFDataset();
      this.binauralScene.setHRTFDataset(this.binauralHRTFDataset);
    } catch (ex) {
      console.error("Failed loading BinauralFIR HRTF dataset:", ex);
    }
    this.isLoadingBinauralHRTFDataset = false;
  }

  setRoomProperties(
    roomDimensions: RoomDimensions,
    roomMaterials: RoomMaterials
  ): void {
    this.resonanceScene.setRoomProperties(roomDimensions, roomMaterials);
  }
}
