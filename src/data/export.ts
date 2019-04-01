/**
 * @author Niklas Korz
 * This module defines functions for exporting and saving projects to the local filesystem.
 */
import { saveAs } from "file-saver";
import Zip from "jszip";
import { SerializedData } from "./Serializable";

/**
 * Serializes the given metadata as JSON and compresses it along the given audio data in a ZIP file.
 * The audio data is saved as one file per audio in a dedicated subdirectory "audio".
 */
export const createZip = (
  metadata: SerializedData,
  audios: ArrayBuffer[]
): Promise<Blob> => {
  const zip = new Zip();
  zip.file("metadata.json", JSON.stringify(metadata));

  const audioFolder = zip.folder("audio");
  for (let i = 0; i < audios.length; i++) {
    audioFolder.file(i.toString(), audios[i]);
  }

  return zip.generateAsync({ type: "blob" });
};

/**
 * Saves the given metadata and audio data as a zip file on the user's local filesystem
 */
export const saveAsZip = async (
  metadata: SerializedData,
  audios: ArrayBuffer[]
) => {
  const data = await createZip(metadata, audios);
  saveAs(data, "audio3d-project.zip");
};
