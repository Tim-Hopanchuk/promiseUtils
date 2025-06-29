const assert = require("assert");
const { sleep } = require("../dist/index");
const { wait } = require("../dist/index");
const { waitFor } = require("../dist/index");
const { doCallbacks } = require("../dist/index");

describe("sleep", function () {
  it("should delay for the given timeout", async function () {
    const timeout = 1000;
    const executionStart = Date.now();
    await sleep(timeout);
    const executionFinish = Date.now();
    const executionTime = executionFinish - executionStart;

    assert.equal(
      true,
      executionTime > timeout * 0.95 && executionTime < timeout * 1.05
    );
  });
});

describe("wait", function () {
  it("should resolve with callback result if it finishes before timeout", function () {
    const callback = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => resolve("Resolved: callback succeed"), 500);
      });

    return wait(callback, 1000).then(
      (result) => assert.equal(result, "Resolved: callback succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject with callback error if the callback rejects before timeout", function () {
    const callback = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => reject("Rejected: callback failed"), 500);
      });

    return wait(callback, 1000).then(
      (result) => assert.equal(result, "Resolved: callback succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject on timeout if the callback takes too long", function () {
    const callback = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => resolve("Resolved: callback succeed"), 1000);
      });

    return wait(callback, 500).then(
      (result) => assert.equal(result, "Resolved: callback succeed"),
      (error) => assert.equal(error, "Rejected: timeout")
    );
  });
});

describe("waitFor", function () {
  it("should resolve when callback returns true", function () {
    const callback = () => true;

    return waitFor(callback, 100, 10).then(
      (result) => assert.equal(result, "Resolved: callback succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject after max retries when callback never returns true", function () {
    const callback = () => false;

    return waitFor(callback, 100, 10).then(
      (result) => assert.equal(result, "Resolved: callback succeed"),
      (error) => assert.equal(error, "Rejected: max retries")
    );
  });

  it("should reject when callback throws error", function () {
    const callback = () => {
      throw new Error("Error");
    };

    return waitFor(callback, 100, 10).then(
      (result) => assert.equal(result, "Resolved: callback succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });
});

describe("doCallbacks", function () {
  it("should resolve when all sync callbacks succeed", function () {
    const callbacks = [() => true, () => true, () => true];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject when any sync callback throws error", function () {
    const callbacks = [
      () => true,
      () => {
        throw new Error("Error");
      },
      () => true,
    ];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should resolve when all async callbacks resolve", function () {
    const callbacks = [
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
    ];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject when any async callback rejects", function () {
    const callbacks = [
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () =>
        new Promise((resolve, reject) => {
          setTimeout(reject, 100);
        }),
    ];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should resolve for mixed sync/async callbacks when all succeed", function () {
    const callbacks = [
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () => true,
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
    ];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject for mixed sync/async callbacks when an async callback rejects", function () {
    const callbacks = [
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () => true,
      () =>
        new Promise((resolve, reject) => {
          setTimeout(reject, 100);
        }),
    ];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });

  it("should reject for mixed sync/async callbacks when a sync callback throws", function () {
    const callbacks = [
      () =>
        new Promise((resolve, reject) => {
          setTimeout(resolve, 100);
        }),
      () => true,
      () => {
        throw new Error("Error");
      },
    ];

    return doCallbacks(callbacks, 300).then(
      (result) => assert.equal(result, "Resolved: callbacks succeed"),
      (error) => assert.equal(error, "Rejected: callback failed")
    );
  });
});
