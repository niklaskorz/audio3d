// Type definitions for Resonance Audio 1.0.0
// Project: https://resonance-audio.github.io/resonance-audio/
// Definitions by: Niklas Korz <https://github.com/niklaskorz>
// Definitions: https://github.com/niklaskorz/audio3d
// TypeScript Version: 3.3

declare module "resonance-audio" {
  export class ResonanceAudio {
    ambisonicInput: AudioNode;
    ambisonicOutput: AudioNode;
    output: AudioNode;
    constructor(
      context: AudioContext,
      options?: Partial<ResonanceAudioOptions>
    );
    createSource(options?: Partial<SourceOptions>): Source;
    setAmbisonicOrder(ambisonicOrder: number): void;
    setListenerMatrix(matrix: Float32Array): void;
    setListenerOrientation(
      forwardX: number,
      forwardY: number,
      forwardZ: number,
      upX: number,
      upY: number,
      upZ: number
    ): void;
    setListenerPosition(x: number, y: number, z: number): void;
    setRoomProperties(
      dimensions: RoomDimensions,
      materials: RoomMaterials
    ): void;
    setSpeedOfSound(speedOfSound: number): void;
  }

  export interface ResonanceAudioOptions {
    ambisonicOrder: number;
    listenerPosition: Float32Array;
    listenerForward: Float32Array;
    listenerUp: Float32Array;
    dimensions: RoomDimensions;
    materials: RoomMaterials;
    speedOfSound: number;
  }

  export class Source {
    input: AudioNode;
    constructor(scene: ResonanceAudio, options?: Partial<SourceOptions>);
    setDirectivityPattern(alpha: number, sharpness: number): void;
    setFromMatrix(matrix4: Float32Array): void;
    setGain(gain: number): void;
    setMaxDistance(maxDistance: number): void;
    setMinDistance(minDistance: number): void;
    setOrientation(
      forwardX: number,
      forwardY: number,
      forwardZ: number,
      upX: number,
      upY: number,
      upZ: number
    ): void;
    setPosition(x: number, y: number, z: number);
    setRolloff(rollof: string): void;
    setSourceWidth(sourceWidth: number): void;
  }

  export interface SourceOptions {
    position: Float32Array;
    forward: Float32Array;
    up: Float32Array;
    minDistance: number;
    maxDistance: number;
    rollof: string;
    gain: number;
    alpha: number;
    sharpness: number;
    sourceWidth: number;
  }

  export class Utils {
    static ATTENUATION_ROLLOFS: string[];
    static DEFAULT_AMBISONIC_ORDER: number;
    static DEFAULT_ATTENUATION_ROLLOFF: string;
    static DEFAULT_AZIMUTH: number;
    static DEFAULT_DIRECTIVITY_ALPHA: number;
    static DEFAULT_DIRECTIVITY_SHARPNESS: number;
    static DEFAULT_ELEVATION: number;
    static DEFAULT_FORWARD: Float32Array;
    static DEFAULT_MAX_DISTANCE: number;
    static DEFAULT_MIN_DISTANCE: number;
    static DEFAULT_POSITION: Float32Array;
    static DEFAULT_REFLECTION_COEFFICIENTS: object;
    static DEFAULT_REFLECTION_CUTOFF_FREQUENCY: number;
    static DEFAULT_REFLECTION_MAX_DURATION: number;
    static DEFAULT_REFLECTION_MIN_DISTANCE: number;
    static DEFAULT_REFLECTION_MULTIPLIER: number;
    static DEFAULT_REVERB_BANDWIDTH: number;
    static DEFAULT_REVERB_DURATION_MULTIPLIER: number;
    static DEFAULT_REVERB_DURATIONS: Float32Array;
    static DEFAULT_REVERB_FREQUENCY_BANDS: number[];
    static DEFAULT_REVERB_GAIN: number;
    static DEFAULT_REVERB_MAX_DURATION: number;
    static DEFAULT_REVERB_PREDELAY: number;
    static DEFAULT_REVERB_TAIL_ONSET: number;
    static DEFAULT_RIGHT: Float32Array;
    static DEFAULT_ROOM_DIMENSIONS: RoomDimensions;
    static DEFAULT_ROOM_MATERIALS: RoomMaterials;
    static DEFAULT_SOURCE_DISTANCE: number;
    static DEFAULT_SOURCE_GAIN: number;
    static DEFAULT_SOURCE_WIDTH: number;
    static DEFAULT_SPEED_OF_SOUND: number;
    static DEFAULT_UP: Float32Array;
    static LISTENER_MAX_OUTSIDE_ROOM_DISTANCE: number;
    static NUMBER_REFLECTION_AVERAGING_BANDS: number;
    static NUMBER_REVERB_FREQUENCY_BANDS: number;
    static ROOM_AIR_ABSORPTION_COEFFICIENTS: Float32Array;
    static ROOM_EYRING_CORRECTION_COEFFICIENT: number;
    static ROOM_MATERIAL_COEFFICIENTS: string[];
    static ROOM_MIN_VOLUME: number;
    static ROOM_STARTING_AVERAGING_BAND: number;
    static SOURCE_MAX_OUTSIDE_ROOM_DISTANCE: number;
  }

  export interface RoomDimensions {
    width: number;
    height: number;
    depth: number;
  }

  export interface RoomMaterials {
    left: string;
    right: string;
    front: string;
    back: string;
    up: string;
    down: string;
  }
}
