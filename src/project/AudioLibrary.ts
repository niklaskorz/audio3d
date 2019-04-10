/**
 * @author Niklas Korz
 */
import { AudioFile } from "../data/schema";
import {
  saveAudio,
  loadAudio,
  deleteAudio,
  saveAudioMap,
  iterateProjectAudios
} from "../data/db";
import { wrapIteratorAsync } from "../utils/iter";

export default class AudioLibrary {
  projectId?: number;
  audioMap = new Map<number, AudioFile>();
  nextId = 0;

  async add(entry: AudioFile): Promise<number> {
    if (this.projectId != null) {
      await saveAudio({
        ...entry,
        projectId: this.projectId,
        audioId: this.nextId
      });
    } else {
      this.audioMap.set(this.nextId, entry);
    }
    return this.nextId++;
  }

  async get(id: number): Promise<AudioFile | undefined> {
    if (this.projectId != null) {
      return await loadAudio(this.projectId, id);
    }
    return this.audioMap.get(id);
  }

  async set(id: number, entry: AudioFile): Promise<void> {
    if (this.projectId != null) {
      await loadAudio(this.projectId, id);
    } else {
      this.audioMap.set(id, entry);
    }
  }

  async delete(id: number): Promise<void> {
    if (this.projectId != null) {
      await deleteAudio(this.projectId, id);
    } else {
      this.audioMap.delete(id);
    }
  }

  async saveToProject(projectId: number): Promise<void> {
    this.projectId = projectId;
    await saveAudioMap(projectId, this.audioMap);
    this.audioMap.clear();
  }

  entries(): AsyncIterableIterator<[number, AudioFile]> {
    if (this.projectId != null) {
      return iterateProjectAudios(this.projectId);
    }
    return wrapIteratorAsync(this.audioMap.entries());
  }
}
