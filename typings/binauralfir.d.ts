// Type definitions for BinauralFIR
// Project: https://resonance-audio.github.io/resonance-audio/
// Definitions by: Leon Erath <https://github.com/leonerath>
// Definitions: https://github.com/niklaskorz/audio3d
// TypeScript Version: 3.3

/* tslint:disable:max-classes-per-file */

declare module "binauralfir" {
  export interface Position {
    azimuth: number;
    elevation: number;
    distance: number;
  }
  export interface Vector3 {
    x: number;
    y: number;
    z: number;
  }
  export interface Options {
    audioContext: AudioContext;
  }
  export interface HRTF {
    azimuth: number;
    elevation: number;
    distance: number;
    buffer: AudioBuffer;
  }

  export default class BinauralFIR {
    input: GainNode;
    HRTFDataset: HRTF[];
    constructor(options: Options);
    setPosition(azimuth: number, elevation: number, distance: number): void;
    connect(node: AudioNode): void;
    disconnect(node: AudioNode): void;
    distance(a: Vector3, b: Vector3): number;
    setCrossfadeDuration(duration: number): void;
    getCrossfadeDuration(): number;
    getPosition(): Position;
  }
}
