"use strict";

export function sleep(timeout: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, timeout);
  });
}

export function wait(callback: () => Promise<unknown>, timeout: number) {
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => reject("Rejected: timeout"), timeout);
    }),
    callback(),
  ]);
}

export async function waitFor(
  callback: () => unknown,
  timeout: number,
  count: number
) {
  for (let i = 0; i < count; i++) {
    try {
      if (callback()) {
        return "Resolved: callback";
      }
    } catch {
      return Promise.reject("Rejected: callback error");
    }
    
    await sleep(timeout);
  }

  return Promise.reject("Rejected: count");
}

export async function doCallbacks(
  callbacks: Array<() => unknown>,
  timeout: number
) {
  for (let callback of callbacks) {
    try {
      await callback();
    } catch {
      return Promise.reject("Callback: error");
    }

    await sleep(timeout);
  }

  return "good";
}