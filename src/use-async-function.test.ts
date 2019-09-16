import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import ReducedStatefulAsyncFunction from './types/reduced-stateful-async-function';
import State from './types/state';
import StatefulAsyncFunction from './types/stateful-async-function';
import useAsyncFunction from './use-async-function';
import AsyncFunctionState from './types/async-function-state';

const TEST_ASYNC_FUNCTION = (str: string): Promise<string> =>
  Promise.resolve(str);

const TEST_STR = 'test str';

describe('useAsyncFunction', (): void => {
  describe('with reducer', (): void => {
    const TEST_REDUCER = (str: string): string => str;

    let result: HookResult<
      ReducedStatefulAsyncFunction<[string], string | undefined, Error>
    >;

    describe('fulfilled', (): void => {
      beforeEach((): void => {
        result = renderHook(
          (): ReducedStatefulAsyncFunction<
            [string],
            string | undefined,
            Error
          > => useAsyncFunction(TEST_ASYNC_FUNCTION, TEST_REDUCER),
        ).result;
      });

      it('should generate a function with no state', (): void => {
        expect(result.current).toBeInstanceOf(Function);
        expect(result.current[TEST_STR]).toBeUndefined();
      });

      it('should return a Promise', async (): Promise<void> => {
        let promise: Promise<string | undefined>;
        act((): void => {
          promise = result.current(TEST_STR);
          expect(promise).toBeInstanceOf(Promise);
        });

        let value: string | undefined;
        await act(
          async (): Promise<void> => {
            value = await promise;
          },
        );
        expect(value).toBe(TEST_STR);
      });

      it('should update the state', async (): Promise<void> => {
        let promise: Promise<string | undefined>;
        act((): void => {
          promise = result.current(TEST_STR);
        });

        let current: AsyncFunctionState<string | undefined, Error> | void =
          result.current[TEST_STR];
        if (!current) {
          throw new Error('State was not created.');
        }
        expect(current.error).toBeUndefined();
        expect(current.state).toBe(State.PENDING);
        expect(current.value).toBeUndefined();

        await act(
          async (): Promise<void> => {
            await promise;
          },
        );

        current = result.current[TEST_STR];
        if (!current) {
          throw new Error('State was lost.');
        }
        expect(current.error).toBeUndefined();
        expect(current.state).toBe(State.FULFILLED);
        expect(current.value).toBe(TEST_STR);
      });
    });
  });

  describe('without reducer', (): void => {
    let result: HookResult<
      StatefulAsyncFunction<[string], string | undefined, Error>
    >;

    describe('fulfilled', (): void => {
      beforeEach((): void => {
        result = renderHook(
          (): StatefulAsyncFunction<[string], string | undefined, Error> =>
            useAsyncFunction(TEST_ASYNC_FUNCTION),
        ).result;
      });

      it('should generate a function with no state', (): void => {
        expect(result.current).toBeInstanceOf(Function);
        expect(result.current.error).toBeUndefined();
        expect(result.current.state).toBeUndefined();
        expect(result.current.value).toBeUndefined();
      });

      it('should return a Promise', async (): Promise<void> => {
        let promise: Promise<string | undefined>;
        act((): void => {
          promise = result.current(TEST_STR);
          expect(promise).toBeInstanceOf(Promise);
        });

        let value: string | undefined;
        await act(
          async (): Promise<void> => {
            value = await promise;
          },
        );
        expect(value).toBe(TEST_STR);
      });

      it('should update the state', async (): Promise<void> => {
        let promise: Promise<string | undefined>;
        act((): void => {
          promise = result.current(TEST_STR);
        });
        expect(result.current.error).toBeUndefined();
        expect(result.current.state).toBe(State.PENDING);
        expect(result.current.value).toBeUndefined();

        await act(
          async (): Promise<void> => {
            await promise;
          },
        );
        expect(result.current.error).toBeUndefined();
        expect(result.current.state).toBe(State.FULFILLED);
        expect(result.current.value).toBe(TEST_STR);
      });
    });
  });
});
