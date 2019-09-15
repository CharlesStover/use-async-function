/* eslint @typescript-eslint/no-explicit-any: 0 */
import AsyncFunction from './async-function';
import AsyncFunctionState from './async-function-state';

type StatefulAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
> = AsyncFunction<A, T> & AsyncFunctionState<T, E>;
export default StatefulAsyncFunction;
