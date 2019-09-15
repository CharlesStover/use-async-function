/* eslint @typescript-eslint/no-explicit-any: 0 */
import AsyncFunction from './async-function';
import AsyncFunctionState from './async-function-state';

export default interface ReducedStatefulAsyncFunction<
  A extends any[],
  T,
  E = Error
> extends AsyncFunction<A, T> {
  [id: string]: AsyncFunctionState<T, E>;
}
