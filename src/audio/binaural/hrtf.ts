/**
 * @author Niklas Korz
 */
import { HRTF } from "binauralfir";
import defaultAudioContext from "../defaultAudioContext";

/**
 * Takes two arrays of floats and turns them into a stereo audio buffer.
 * @param firCoeffsLeft The data to be used for the left audio channel
 * @param firCoeffsRight The data to be used for the right audio channel
 */
const firCoefficientsToAudioBuffer = (
  firCoeffsLeft: number[],
  firCoeffsRight: number[]
): AudioBuffer => {
  const buffer = defaultAudioContext.createBuffer(
    2, // Stereo
    512, // Samples
    defaultAudioContext.sampleRate // Sample rate - unfortunately, we _have_ to use the system's sample rate here as Chrome does not allow any other values
  );
  buffer.copyToChannel(new Float32Array(firCoeffsLeft), 0);
  buffer.copyToChannel(new Float32Array(firCoeffsRight), 1);
  return buffer;
};

/**
 * Asynchronously loads and returns a BinauralFIR compatible HRTF dataset
 */
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
