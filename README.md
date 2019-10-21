# useAsyncFunction [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=useAsyncFunction%20integrates%20your%20asynchronous%20function%20state%20with%20a%20React%20component's%20local%20state.&url=https://github.com/CharlesStover/use-async-function&via=CharlesStover&hashtags=react,reactjs,javascript,typescript,webdev,webdevelopment) [![version](https://img.shields.io/npm/v/use-async-function.svg)](https://www.npmjs.com/package/use-async-function) [![minzipped size](https://img.shields.io/bundlephobia/minzip/use-async-function.svg)](https://www.npmjs.com/package/use-async-function) [![downloads](https://img.shields.io/npm/dt/use-async-function.svg)](https://www.npmjs.com/package/use-async-function) [![build](https://api.travis-ci.com/CharlesStover/use-async-function.svg)](https://travis-ci.com/CharlesStover/use-async-function/)

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

  if (dispatch.state === State.Fulfilled) {
    return <div>The response was {dispatch.value}.</div>;
  }

  if (dispatch.state === State.Rejected) {
    return <div>An error occurred: {dispatch.error}</div>;
  }

  // Pending and uninitiated.
  return <Loading />;
}
```

## Parameters

### useAsyncFunction(Function)

The first parameter of the `useAsyncFunction` hook is the asynchronous function
itself.

### useAsyncFunction(Function, Options)

If you are not using an [identity reducer](#identity-reducer), the second
parameter of the `useAsyncFunction` hook is the [options](#options) object.

### useAsyncFunction(Function, Reducer)

If you are using an [identity reducer](#identity-reducer), the second parameter
of the `useAsyncFunction` hook is the identity reducer.

### useAsyncFunction(Function, Reducer, Options)

If you are using both an [identity reducer](#identity-reducer) and an
[options](#options) object, the identity reducer is the second parameter of the
`useAsyncFunction` hook, and the options object is the third parameter of the
`useAsyncFunction` hook.

## Identity Reducer

An identity reducer allows you to track multiple calls to the same asynchronous
function. This is particularly useful when tracking API calls, where each call's
fulfillment, pending, and rejection states are unique.

An identity reducer takes the call's arguments as its arguments and returns a
string unique to that call.

```javascript
// Asynchronously fetch a user's data by their username.
function fetchUser({ username }) {
  return fetch(`/users/${username}`);
}

// Uniquely identify an asynchronous function call by the username.
function idByUsername({ username }) {
  return username;
}

function MyComponent() {
  const dispatch = useAsyncFunction(fetchUser, idByUsername);

  // We can determine if this call has been made by the presence of a property
  //   with the call's ID.
  if (!dispatch.admin) {
    dispatch({ username: 'admin' });
    return null;
  }
  if (!dispatch.bob) {
    dispatch({ username: 'bob' });
    return null;
  }

  // The state of the call is stored on the property with the call's ID.
  if (dispatch.admin.state === State.Fulfilled) {
    return <div>Admin loaded with {dispatch.admin.value}.</div>;
  }
}
```

## Options

### throwError

**Default:** `false`

**Type:** `boolean`

If `true`, the asynchronous function will throw any encountered errors,
requiring a `.catch` block.

If `false`, the asynchronous function will swallow any errors. The component
will rerender, and the `error` property of the async function will be set to the
caught error.

## Sponsor 💗

If you are a fan of this project, you may
[become a sponsor](https://github.com/sponsors/CharlesStover)
via GitHub's Sponsors Program.
