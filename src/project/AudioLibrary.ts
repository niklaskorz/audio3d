/**
 * @author Niklas Korz
 */

export default class AudioLibrary extends Map<number, ArrayBuffer> {
  nextId = 0;

  add(data: ArrayBuffer): this {
    this.set(this.nextId, data);
    this.nextId++;

    return this;
  }
}
