import { HRTF } from "binauralfir";
import defaultAudioContext from "../defaultAudioContext";

const firCoefficientsToAudioBuffer = (
  firCoeffsLeft: number[],
  firCoeffsRight: number[]
): AudioBuffer => {
  const buffer = defaultAudioContext.createBuffer(
    2,
    512,
    defaultAudioContext.sampleRate
  );
  buffer.copyToChannel(new Float32Array(firCoeffsLeft), 0);
  buffer.copyToChannel(new Float32Array(firCoeffsRight), 1);
  return buffer;
};

export const loadHRTFDataset = async (): Promise<HRTF[]> => {
  const resp = await fetch("data/ircam-hrtf.json");
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
