import AsyncFunctionState from '../types/async-function-state';

export type Action<T, E> = AsyncFunctionState<T, E> & HasId;

interface HasId {
  id: string;
}

export default function asyncFunctionReducer<T, E>(
  asyncFunctionStateMap: Map<string, AsyncFunctionState<T, E>>,
  { id, ...asyncFunctionState }: Action<T, E>,
): Map<string, AsyncFunctionState<T, E>> {
  const newAsyncFunctionStateMap: Map<
    string,
    AsyncFunctionState<T, E>
  > = new Map<string, AsyncFunctionState<T, E>>(asyncFunctionStateMap);
  newAsyncFunctionStateMap.set(id, asyncFunctionState);
  return newAsyncFunctionStateMap;
}
