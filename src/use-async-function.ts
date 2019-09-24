/* eslint @typescript-eslint/no-explicit-any: 0 */
import {
  Reducer,
  MutableRefObject,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import AsyncFunction from './types/async-function';
import AsyncFunctionState from './types/async-function-state';
import ReducedStatefulAsyncFunction from './types/reduced-stateful-async-function';
import StatefulAsyncFunction from './types/stateful-async-function';
import State from './types/state';
import asyncFunctionReducer, { Action } from './utils/async-function-reducer';

type AsyncFunctionIdReducer<A extends any[]> = (...args: A) => string;

type Options = OptionsThrowErrorFalse | OptionsThrowErrorTrue;

interface OptionsThrowErrorFalse {
  throwError?: false;
}

interface OptionsThrowErrorTrue {
  throwError: true;
}

type VoidFunction = () => void;

const DEFAULT_OPTIONS: Options = Object.create(null);
const DEFAULT_REDUCER: AsyncFunctionIdReducer<any[]> = (): '_' => '_';

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
): StatefulAsyncFunction<A, T | undefined, E>;

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
  reducer: AsyncFunctionIdReducer<A>,
): ReducedStatefulAsyncFunction<A, T, E>;

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
  reducer: AsyncFunctionIdReducer<A>,
  options: OptionsThrowErrorFalse,
): ReducedStatefulAsyncFunction<A, T | undefined, E>;

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
  reducer: AsyncFunctionIdReducer<A>,
  options: OptionsThrowErrorTrue,
): ReducedStatefulAsyncFunction<A, T, E>;

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
  options: OptionsThrowErrorFalse,
): StatefulAsyncFunction<A, T | undefined, E>;

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
  options: OptionsThrowErrorTrue,
): StatefulAsyncFunction<A, T, E>;

export default function useAsyncFunction<
  A extends any[],
  T extends any,
  E = Error
>(
  asyncFunction: AsyncFunction<A, T>,
  _reducer: Options | AsyncFunctionIdReducer<A> = DEFAULT_REDUCER,
  _options: Options = DEFAULT_OPTIONS,
):
  | ReducedStatefulAsyncFunction<A, T | undefined, E>
  | StatefulAsyncFunction<A, T | undefined, E> {
  // Sanitize user input by converting (func, options) to
  //   (func, reducer, options)
  const reducer: AsyncFunctionIdReducer<A> =
    typeof _reducer === 'function' ? _reducer : DEFAULT_REDUCER;
  const options: Options = typeof _reducer === 'object' ? _reducer : _options;

  const [state, setState] = useReducer<
    Reducer<Map<string, AsyncFunctionState<T, E>>, Action<T, E>>
  >(asyncFunctionReducer, new Map<string, AsyncFunctionState<T, E>>());

  const mounted: MutableRefObject<boolean> = useRef(true);

  const call:
    | ReducedStatefulAsyncFunction<A, T | undefined, E>
    | StatefulAsyncFunction<A, T | undefined, E> = useMemo(():
    | ReducedStatefulAsyncFunction<A, T | undefined, E>
    | StatefulAsyncFunction<A, T | undefined, E> => {
    const call:
      | ReducedStatefulAsyncFunction<A, T | undefined, E>
      | StatefulAsyncFunction<A, T | undefined, E> = (async (
      ...args: A
    ): Promise<T | undefined> => {
      const id: string = reducer(...args);

      // Pending

      if (mounted.current) {
        setState({
          error: undefined,
          id,
          state: State.PENDING,
          value: undefined,
        });
      }

      try {
        const aValue: T = await asyncFunction(...args);

        // Fulfilled
        if (mounted.current) {
          setState({
            error: undefined,
            id,
            state: State.FULFILLED,
            value: aValue,
          });
        }
        return aValue;
      } catch (e) {
        // Rejected
        if (mounted.current) {
          setState({
            error: e,
            id,
            state: State.REJECTED,
            value: undefined,
          });
        }

        // If we are explicitly told to throw an error, do so.
        if (options.throwError === true) {
          throw e;
        }

        // If we are not explicitly told to throw an error, return undefined.
        return;
      }
    }) as
      | ReducedStatefulAsyncFunction<A, T | undefined, E>
      | StatefulAsyncFunction<A, T | undefined, E>;

    // Assign the state to the async function.
    if (reducer === DEFAULT_REDUCER) {
      Object.assign(call, state.get('_'));
    } else {
      for (const [id, asyncFunctionState] of state.entries()) {
        (call as ReducedStatefulAsyncFunction<A, T | undefined, E>)[
          id
        ] = asyncFunctionState;
      }
    }

    return call;
  }, [asyncFunction, mounted, options.throwError, reducer, state]);

  useEffect((): VoidFunction => {
    return (): void => {
      mounted.current = false;
    };
  }, []);

  return call;
}
