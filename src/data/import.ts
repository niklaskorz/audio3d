/**
 * @author Niklas Korz
 * This module defines functions for loading and importing projects from the local filesystem.
 */
import Zip, { JSZipObject } from "jszip";
import Project from "../project/Project";
import { openFileDialog } from "../utils/files";

/**
 * Decompresses the given zip file, loads the included JSON metadata and reads all
 * included audio files as binary array buffers.
 * @param blob The blob to read from, usually a file returned by a FileReader instance.
 * @returns The project recreated from the data found in the zip
 */
export const loadZip = async (blob: Blob): Promise<Project> => {
  const zip = await Zip.loadAsync(blob);
  const metadata = JSON.parse(await zip.file("metadata.json").async("text"));

  const audioLibrary = JSON.parse(
    await zip.file("audioLibrary.json").async("text")
  );
  const audioFolder = zip.folder("audio");
  const project = new Project();
  for (const { id, name, type } of audioLibrary) {
    const data = await audioFolder.file(id.toString()).async("arraybuffer");
    project.audioLibrary.set(id, { name, type, data });

    if (id >= project.audioLibrary.nextId) {
      project.audioLibrary.nextId = id + 1;
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
