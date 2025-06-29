"use strict";

/**
 * Returns a promise that resolves after a timeout.
 *
 * @param {number} timeout - Milliseconds before resolving.
 * @returns {Promise<void>} A promise that resolves after the timeout.
 */

export function sleep(timeout: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * Executes an async callback and returns a promise that resolves with its result.
 * Rejects if the timeout is reached first.
 *
 * @param {() => Promise<T>} callback - An async function to execute.
 * @param {number} timeout - Milliseconds before rejecting.
 * @returns {Promise<string | T>} A promise that resolves with the callback's result or rejects on timeout.
 */

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

/**
 * Repeatedly calls a function until it returns true, or a max number of attempts is reached. 
 * Has a delay between calls.
 *
 * @param {() => boolean} callback - A sync function to execute.
 * @param {number} timeout - Milliseconds between calls.
 * @param {number} tries - Max number of attempts.
 * @returns {Promise<string>} A promise that resolves when callback returns true, or rejects on failure or Max number of attempts reached.
 */

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

/**
 * Executes a list of functions sequentially with a delay between calls.
 *
 * @param {Array<() => T | Promise<T>>} callbacks - An array of sync or async functions to execute.
 * @param {number} timeout - Milliseconds between calls.
 * @returns {Promise<string | T>}  A promise that resolves if all functions succeed, or rejects if any function fails.
 */

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