/**
 * @author Niklas Korz
 */

export default class AudioLibrary extends Map<number, ArrayBuffer> {
  nextId = 0;

  add(data: ArrayBuffer): number {
    this.set(this.nextId, data);
    return this.nextId++;
  }
}
