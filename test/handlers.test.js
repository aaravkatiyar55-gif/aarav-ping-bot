const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MENTION_MESSAGE,
  PONG_MESSAGE,
  handleAppMention,
  handlePingCommand,
} = require("../src/handlers");

test("/aarav-ping ko acknowledge karke Pong respond karta hai", async () => {
  let acknowledged = false;
  let response;

  await handlePingCommand({
    ack: async () => { acknowledged = true; },
    respond: async (message) => { response = message; },
    logger: { error: () => {} },
  });

  assert.equal(acknowledged, true);
  assert.equal(response, PONG_MESSAGE);
});

test("@mention ka reply same message thread mein bhejta hai", async () => {
  let sentMessage;

  await handleAppMention({
    event: { ts: "123.456" },
    say: async (message) => { sentMessage = message; },
    logger: { error: () => {} },
  });

  assert.deepEqual(sentMessage, {
    text: MENTION_MESSAGE,
    thread_ts: "123.456",
  });
});
