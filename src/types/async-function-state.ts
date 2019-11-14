import State from './state';

type AsyncFunctionState<T, E> =
  | Fulfilled<T>
  | Pending
  | Rejected<E>
  | Undefined;
export default AsyncFunctionState;

interface Fulfilled<T> {
  error: undefined;
  state: State.Fulfilled;
  value: T;
}

interface Pending {
  error: undefined;
  state: State.Pending;
  value: undefined;
}

interface Rejected<E> {
  error: E;
  state: State.Rejected;
  value: undefined;
}

interface Undefined {
  error: undefined;
  state: undefined;
  value: undefined;
}
