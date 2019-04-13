import { ResonanceAudio } from "resonance-audio";
import BinauralScene from "./binaural/BinauralScene";

export default class AudioScene {
  resScene: ResonanceAudio | undefined;
  binauralScene: BinauralScene | undefined;

  constructor() {}
}
