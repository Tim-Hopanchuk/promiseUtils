# promiseUtils

**promiseUtils** is a small utility library for working with asynchronous logic in JavaScript/TypeScript.  
Includes tools for delaying execution, retrying operations, handling timeouts, and executing sequences with delays.

## Features

- Delay execution with `sleep()`
- Timeout async operations using `wait()`
- Recurring sync checks with `waitFor()`
- Run async/sync callbacks sequentially with delays using `doCallbacks()`

## Technologies Used

- JavaScript
- TypeScript
- Git
- Mocha
- Webpack

## API

### `sleep()`

Returns a promise that resolves after the specified timeout.

```ts
function sleep(timeout: number): Promise<void>;

// Example
await sleep(1000); // waits for 1 second
```

### `wait()`

Executes an async callback and returns a promise that resolves with its result.
Rejects if the timeout is reached first.

```ts
function wait<T>(
  callback: () => Promise<T>,
  timeout: number
): Promise<string | T>;

// Example
await wait(() => fetch("/api/data"), 2000);
```

### `waitFor()`

Calls a sync function repeatedly with a delay between calls, until it returns true 
or the maximum number of attempts is reached.

```ts
function waitFor(
  callback: () => boolean,
  timeout: number,
  tries: number
): Promise<string>;

// Example
await waitFor(() => document.readyState === "complete", 500, 10);
```

### `doCallbacks()`

Executes an array of async/sync callbacks one after another, with a delay between each. 
Rejects if any callback throws error or returns a rejected promise.

```ts
function doCallbacks<T>(
  callbacks: Array<() => T | Promise<T>>,
  timeout: number
): Promise<string | T>;

// Example
await doCallbacks(
  [
    () => console.log("Step 1"),
    () => fetch("/api/step2"),
    () => new Promise((resolve) => setTimeout(resolve, 100)),
  ],
  1000
);
```
