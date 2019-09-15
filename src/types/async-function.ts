/* eslint @typescript-eslint/no-explicit-any: 0 */

export default interface AsyncFunction<A extends any[], T> {
  (...args: A): Promise<T>;
}
