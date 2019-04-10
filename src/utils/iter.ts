/**
 * @author Niklas Korz
 * This modules defines utility functions for working with iterators
 */

/**
 * Wraps an IterableIterator in an AsyncIterableIterator
 * @param iterator The iterator to be wrapped
 */
export async function* wrapIteratorAsync<T>(
  iterator: IterableIterator<T>
): AsyncIterableIterator<T> {
  for (const element of iterator) {
    yield element;
  }
}
