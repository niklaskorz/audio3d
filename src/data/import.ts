/**
 * @author Niklas Korz
 * This module defines functions for loading and importing projects from the local filesystem.
 */
import Zip, { JSZipObject } from "jszip";
import Project from "../project/Project";
import { openFileDialog } from "../utils/openFileDialog";

interface FolderItem {
  name: string;
  file: JSZipObject;
}

/**
 * Iterates over all files at the root of a zip folder and returns them as an array.
 */
const getFilesInFolder = (folder: Zip): FolderItem[] => {
  const files: FolderItem[] = [];
  folder.forEach((name, file) => files.push({ name, file }));
  return files;
};

/**
 * Decompresses the given zip file, loads the included JSON metadata and reads all
 * included audio files as binary array buffers.
 * @param data The blob to read from, usually a file returned by a FileReader instance.
 * @returns The project recreated from the data found in the zip
 */
export const loadZip = async (data: Blob): Promise<Project> => {
  const zip = await Zip.loadAsync(data);
  const metadata = JSON.parse(await zip.file("metadata.json").async("text"));

  const audioFolder = zip.folder("audio");
  const project = new Project();
  for (const { name, file } of getFilesInFolder(audioFolder)) {
    const id = parseInt(name, 10);
    // Only load files in the audio folder which have a valid id as name
    if (!isNaN(id)) {
      project.audioLibrary.set(id, await file.async("arraybuffer"));

      if (id >= project.audioLibrary.nextId) {
        project.audioLibrary.nextId = id + 1;
      }
    }
  }

  project.fromData(metadata);

  return project;
};

/**
 * Opens a file dialog and lets the user select a zip file that will be parsed
 * and loaded as a project.
 * @returns The project found in the zip
 */
export const openZip = async (): Promise<Project> => {
  const file = await openFileDialog({ accept: "application/zip" });
  return await loadZip(file);
};
