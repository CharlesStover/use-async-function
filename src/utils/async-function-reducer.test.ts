import AsyncFunctionState from '../types/async-function-state';
import State from '../types/state';
import asyncFunctionReducer from './async-function-reducer';

type AFS = AsyncFunctionState<string, Error>;

const INITIAL_STATE: Map<string, AFS> = new Map<string, AFS>();

describe('asyncFunctionReducer', (): void => {
  it('should add a state for an id', (): void => {
    const TEST_ID = 'test id';
    const TEST_VALUE = 'test value';
    const reducedStateMap: Map<string, AFS> = asyncFunctionReducer(
      INITIAL_STATE,
      {
        error: undefined,
        id: TEST_ID,
        state: State.Fulfilled,
        value: TEST_VALUE,
      },
    );
    expect(reducedStateMap.has(TEST_ID)).toBe(true);
    const reducedState: AFS = reducedStateMap.get(TEST_ID) as AFS;
    expect(reducedState.error).toBeUndefined();
    expect(reducedState.value).toBe(TEST_VALUE);
  });
});
