import { renderHook } from '@testing-library/react-hooks';
import ReducedStatefulAsyncFunction from './types/reduced-stateful-async-function';
import StatefulAsyncFunction from './types/stateful-async-function';
import useAsyncFunction from './use-async-function';

const TEST_ASYNC_FUNCTION = (str: string): Promise<string> =>
  Promise.resolve(str);

describe('useAsyncFunction', (): void => {
  describe('with reducer', (): void => {
    const TEST_REDUCER = (str: string): string => str;

    it('should generate a function with no state', (): void => {
      const { result } = renderHook(
        (): ReducedStatefulAsyncFunction<[string], string | undefined, Error> =>
          useAsyncFunction(TEST_ASYNC_FUNCTION, TEST_REDUCER),
      );
      expect(result.current).toBeInstanceOf(Function);
      expect(result.current.error).toBeUndefined();
      expect(result.current.state).toBeUndefined();
      expect(result.current.value).toBeUndefined();
    });
  });

  describe('without reducer', (): void => {
    it('should generate a function with no state', (): void => {
      const { result } = renderHook(
        (): StatefulAsyncFunction<[string], string | undefined, Error> =>
          useAsyncFunction(TEST_ASYNC_FUNCTION),
      );
      expect(result.current).toBeInstanceOf(Function);
      expect(result.current.error).toBeUndefined();
      expect(result.current.state).toBeUndefined();
      expect(result.current.value).toBeUndefined();
    });
  });
});
