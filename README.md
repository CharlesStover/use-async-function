# useAsyncFunction

`useAsyncFunction` is a React hook that integrates an asynchronous function's
state with a React function component's state. This automates the process of
re-rendering the React function component as the asynchronous function's state
changes between pending, resolved, and rejected.

## Install

- `npm i use-async-function` or
- `yarn add use-async-function`

## Use

```javascript
import useAsyncFunction, { State } from 'use-async-function';

const myAsyncFunction = async (): Promise<void> => {
  await one();
  await two();
  return 'three';
};

function MyComponent() {
  const dispatch = useAsyncFunction(myAsyncFunction);

  if (!dispatch.state) {
    dispatch();
  }

  if (dispatch.state === State.FULFILLED) {
    return <div>The response was {dispatch.value}.</div>;
  }

  if (dispatch.state === State.REJECTED) {
    return <div>An error occurred: {dispatch.error}</div>;
  }

  // Pending and uninitiated.
  return <Loading />;
}
```

## Parameters

### useAsyncFunction(Function)

### useAsyncFunction(Function, Options)

### useAsyncFunction(Function, Reducer)

### useAsyncFunction(Function, Reducer, Options)

## Options

### throwError

**Default:** `false`

**Type:** `boolean`

If `true`, the asynchronous function will throw any encountered errors,
requiring a `.catch` block.

If `false`, the asynchronous function will swallow any errors. The component
will rerender, and the `error` property of the async function will be set to the
caught error.
