/**
 * @author Niklas Korz, Leon Erath
 */

import { Vector3 } from "three";
import { HRTF } from "binauralfir";
import defaultAudioContext from "../defaultAudioContext";
import BinauralSource from "./BinauralSource";

const dummyHRTFDataset: HRTF[] = [
  {
    azimuth: 1,
    elevation: 1,
    distance: 1,
    buffer: defaultAudioContext.createBuffer(2, 512, 44100)
  }
];

export default class BinauralScene {
  listenerPosition = new Vector3(0, 0, 0);
  listenerOrientation = new Vector3(0, 0, 0);
  sources: BinauralSource[] = [];
  audioContext: AudioContext;
  hrtfDataset: HRTF[];

  constructor(
    audioContext: AudioContext,
    hrtfDataset: HRTF[] = dummyHRTFDataset
  ) {
    this.audioContext = audioContext;
    this.hrtfDataset = hrtfDataset;
  }

  createSource(): BinauralSource {
    const source = new BinauralSource(this);
    this.sources.push(source);
    return source;
  }

  setHRTFDataset(hrtfDataset: HRTF[]): void {
    this.hrtfDataset = hrtfDataset;
    for (const source of this.sources) {
      source.binauralFIR.HRTFDataset = hrtfDataset;
    }
  }

  update(): void {
    for (const source of this.sources) {
      source.update();
    }
  }
}
