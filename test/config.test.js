const test = require("node:test");
const assert = require("node:assert/strict");
const { readConfig, readOptionalPort } = require("../src/config");

test("synthetic Slack token shapes aur optional PORT accept karta hai", () => {
  assert.deepEqual(
    readConfig({
      SLACK_BOT_TOKEN: "xoxb-synthetic-test-only",
      SLACK_APP_TOKEN: "xapp-synthetic-test-only",
      PORT: "3000",
    }),
    {
      botToken: "xoxb-synthetic-test-only",
      appToken: "xapp-synthetic-test-only",
      port: 3000,
    },
  );
});

test("placeholder aur wrong token type reject karta hai", () => {
  assert.throws(
    () => readConfig({
      SLACK_BOT_TOKEN: "xoxb-your-bot-token-here",
      SLACK_APP_TOKEN: "xapp-synthetic-test-only",
    }),
    /SLACK_BOT_TOKEN/,
  );
});

test("invalid PORT reject karta hai", () => {
  assert.throws(() => readOptionalPort({ PORT: "70000" }), /PORT/);
  assert.throws(() => readOptionalPort({ PORT: "not-a-number" }), /PORT/);
});
