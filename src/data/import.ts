/**
 * @author Niklas Korz
 * This module defines functions for loading and importing projects from the local filesystem.
 */
import Zip, { JSZipObject } from "jszip";
import { SerializedData } from "./Serializable";

/**
 * Iterates over all files at the root of a zip folder and returns them as an array.
 * Returned array is sorted numerically by file name, i.e. 1 2 9 10 11 instead
 * of 1 10 11 2 9.
 */
const getFilesInFolder = (folder: Zip): JSZipObject[] => {
  return Object.keys(folder.files)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map(key => folder.files[key]);
};

interface LoadedData {
  metadata: SerializedData;
  audios: ArrayBuffer[];
}

/**
 * Decompresses the given zip file, loads the included JSON metadata and reads all
 * included audio files as binary array buffers.
 * @param data The blob to read from, usually a file returned by a FileReader instance.
 */
export const loadZip = async (data: Blob): Promise<LoadedData> => {
  const zip = await Zip.loadAsync(data);
  const metadata = JSON.parse(await zip.file("metadata.json").async("text"));

  const audioFolder = zip.folder("audio");
  const audios = await Promise.all(
    getFilesInFolder(audioFolder).map(f => f.async("arraybuffer"))
  );

  return { metadata, audios };
};
