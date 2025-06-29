"use strict";

export function sleep(timeout: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, timeout);
  });
}

export function wait<T>(
  callback: () => Promise<T>,
  timeout: number
): Promise<string | T> {
  return Promise.race([
    new Promise<string>((resolve, reject) => {
      setTimeout(() => reject("Rejected: timeout"), timeout);
    }),
    callback(),
  ]);
}

export async function waitFor(
  callback: () => boolean,
  timeout: number,
  tries: number
): Promise<string> {
  for (let i = 0; i < tries; i++) {
    try {
      if (callback()) {
        return "Resolved: callback succeed";
      }
    } catch {
      return Promise.reject("Rejected: callback failed");
    }

    await sleep(timeout);
  }
  return Promise.reject("Rejected: max retries");
}

export async function doCallbacks<T>(
  callbacks: Array<() => T | Promise<T>>,
  timeout: number
): Promise<string | T> {
  for (let callback of callbacks) {
    try {
      await callback();
    } catch {
      return Promise.reject("Rejected: callback failed");
    }

    await sleep(timeout);
  }
  return "Resolved: callbacks succeed";
}