import State from './state';

type AsyncFunctionState<T, E> = Fulfilled<T> | Pending | Rejected<E>;
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
