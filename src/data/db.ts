/**
 * @author Niklas Korz
 * Module for loading and saving projects and audio files from/to IndexedDB.
 */
import { openDB } from "idb";
import Project from "../project/Project";
import { Schema, AudioWithIds, AudioFile, ProjectData } from "./schema";

const dbPromise = openDB<Schema>("audio3d", 1, {
  upgrade(db) {
    const projectStore = db.createObjectStore("projects", {
      keyPath: "id",
      autoIncrement: true
    });
    projectStore.createIndex("savedAt", "savedAt");
    const audioStore = db.createObjectStore("audios", {
      keyPath: ["projectId", "audioId"]
    });
    audioStore.createIndex("project", "projectId");
  }
});

export const loadProject = async (id: number): Promise<Project | undefined> => {
  const db = await dbPromise;
  const data = await db.get("projects", id);
  return data && new Project().fromData(data, id);
};

export const saveProject = async (project: Project): Promise<number> => {
  const db = await dbPromise;
  const data = project.toData();
  return await db.put("projects", data);
};

export const deleteProject = async (id: number): Promise<void> => {
  const db = await dbPromise;
  // Database transaction
  const tx = db.transaction(["audios", "projects"], "readwrite");
  // Object stores
  const projects = tx.objectStore("projects");
  const audios = tx.objectStore("audios");

  // Delete project
  await projects.delete(id);

  // Delete all related audio files
  let cursor = await audios.index("project").openKeyCursor(id);
  while (cursor) {
    await audios.delete(cursor.primaryKey);
    cursor = await cursor.continue();
  }

  await tx.done;
};

export const getAllProjects = async (): Promise<ProjectData[]> => {
  const db = await dbPromise;
  return await db.getAllFromIndex("projects", "savedAt");
};

export const loadAudio = async (
  projectId: number,
  audioId: number
): Promise<AudioWithIds | undefined> => {
  const db = await dbPromise;
  const data = await db.get("audios", [projectId, audioId]);
  return data;
};

export const saveAudio = async (audio: AudioWithIds): Promise<void> => {
  const db = await dbPromise;
  await db.put("audios", audio);
};

export const saveAudioMap = async (
  projectId: number,
  audioMap: Map<number, AudioFile>
): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction("audios", "readwrite");
  for (const [audioId, entry] of audioMap.entries()) {
    tx.store.put({ ...entry, projectId, audioId });
  }
  await tx.done;
};

export const deleteAudio = async (
  projectId: number,
  audioId: number
): Promise<void> => {
  const db = await dbPromise;
  await db.delete("audios", [projectId, audioId]);
};

export async function* iterateProjectAudios(
  projectId: number
): AsyncIterableIterator<[number, AudioFile]> {
  const db = await dbPromise;
  const tx = db.transaction("audios");
  let cursor = await tx.store.index("project").openCursor(projectId);
  while (cursor) {
    yield [cursor.value.audioId, cursor.value];
    cursor = await cursor.continue();
  }
  await tx.done;
}
