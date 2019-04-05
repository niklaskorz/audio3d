/**
 * @author Niklas Korz
 */

export interface AudioFile {
  name: string;
  type: string;
  data: ArrayBuffer;
}

export default class AudioLibrary extends Map<number, AudioFile> {
  nextId = 0;

  add(entry: AudioFile): number {
    this.set(this.nextId, entry);
    return this.nextId++;
  }
}
