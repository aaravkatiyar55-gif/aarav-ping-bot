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

    ready = false;
    response = await fetch(`http://127.0.0.1:${port}/healthz`);
    assert.equal(response.status, 503);
  } finally {
    await close(server);
  }
});

test("public demo reports real readiness without exposing configuration", async () => {
  let ready = false;
  const server = createHealthServer({ isReady: () => ready });
  await listen(server, 0);
  const url = `http://127.0.0.1:${server.address().port}/`;
  try {
    let response = await fetch(url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(response.headers.get("content-security-policy"), /default-src 'none'/);
    assert.match(await response.text(), /not ready yet/);
    ready = true;
    response = await fetch(url);
    const html = await response.text();
    assert.match(html, /connected to Slack/);
    assert.match(html, /\/aarav-help/);
    assert.doesNotMatch(html, /xoxb-|xapp-|SLACK_BOT_TOKEN/);
    assert.equal((await fetch(url, { method: "POST" })).status, 404);
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
