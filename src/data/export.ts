/**
 * @author Niklas Korz
 * This module defines functions for exporting and saving projects to the local filesystem.
 */
import { saveAs } from "file-saver";
import Zip from "jszip";
import Project from "../project/Project";

/**
 * Serializes the given project as JSON and compresses it along its audio
 * data in a ZIP file. The audio data is saved as one file per audio in a
 * dedicated subdirectory "audio".
 */
export const createZip = (project: Project): Promise<Blob> => {
  const metadata = project.toData();
  const zip = new Zip();
  zip.file("metadata.json", JSON.stringify(metadata));

  const audioFolder = zip.folder("audio");
  for (const [key, value] of project.audioLibrary.entries()) {
    audioFolder.file(key.toString(), value);
  }

  return zip.generateAsync({ type: "blob" });
};

/**
 * Saves the given project, including its audio data, as a zip file on the
 * user's local filesystem
 */
export const saveAsZip = async (project: Project) => {
  const data = await createZip(project);
  saveAs(data, "audio3d-project.zip");
};
