/**
 * @author Niklas Korz
 * This module defines functions for loading and importing projects from the local filesystem.
 */
import Zip, { JSZipObject } from "jszip";

/**
 * Iterates over all files at the root of a zip folder and returns them as an array.
 */
const getFilesInFolder = (folder: Zip): JSZipObject[] => {
  const files: JSZipObject[] = [];
  folder.forEach((_, file) => {
    files.push(file);
  });
  return files;
};

interface LoadedData {
  metadata: object;
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
