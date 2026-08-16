const test = require("node:test");
const assert = require("node:assert/strict");
const { close, createHealthServer, listen } = require("../src/health");

test("/healthz readiness state ke hisaab se 503 phir 200 deta hai", async () => {
  let ready = false;
  const server = createHealthServer({ isReady: () => ready });

  await listen(server, 0);
  const { port } = server.address();

  try {
    let response = await fetch(`http://127.0.0.1:${port}/healthz`);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { status: "starting" });

    ready = true;
    response = await fetch(`http://127.0.0.1:${port}/healthz`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ready" });
  } finally {
    await close(server);
  }
});

test("unknown health path ko 404 deta hai", async () => {
  const server = createHealthServer({ isReady: () => true });
  await listen(server, 0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/other`);
    assert.equal(response.status, 404);
  } finally {
    await close(server);
  }
});
