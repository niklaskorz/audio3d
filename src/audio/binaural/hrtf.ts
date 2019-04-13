import { HRTF } from "binauralfir";

let audioContext = new AudioContext();

const firCoefficientsToAudioBuffer = (
  firCoeffsLeft: number[],
  firCoeffsRight: number[]
): AudioBuffer => {
  const buffer = audioContext.createBuffer(2, 512, 44100);
  buffer.copyToChannel(new Float32Array(firCoeffsLeft), 0);
  buffer.copyToChannel(new Float32Array(firCoeffsRight), 1);
  return buffer;
};

export const loadHRTFDataset = async (): Promise<HRTF[]> => {
  const resp = await fetch("/data/ircam-hrtf.json");
  const dataset = await resp.json();

  return dataset.map((hrtf: any) => ({
    azimuth: hrtf.azimuth,
    elevation: hrtf.elevation,
    distance: hrtf.distance,
    buffer: firCoefficientsToAudioBuffer(
      hrtf.fir_coeffs_left,
      hrtf.fir_coeffs_right
    )
  }));
};
