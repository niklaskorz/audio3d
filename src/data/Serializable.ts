/**
 * @author Niklas Korz
 */

export interface SerializedData {
  [key: string]: any;
}

/**
 * This interface describes classes that support serializing its instances to
 * plain JavaScript objects and loading data from serialized objects into the
 * instance.
 */
export default interface Serializable {
  // Serialize instance to a plain JavaScript object
  toData(): SerializedData;
  // Load data from a plain JavaScript object into this instance
  fromData(data: SerializedData): this;
}
