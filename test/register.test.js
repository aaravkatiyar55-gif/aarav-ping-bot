const test = require("node:test");
const assert = require("node:assert/strict");

const { registerBotHandlers } = require("../src/register");

test("do unique slash commands aur app mention handler register karta hai", () => {
  const commands = [];
  const events = [];
  const app = {
    command: (name, handler) => commands.push({ name, handler }),
    event: (name, handler) => events.push({ name, handler }),
  };

  registerBotHandlers(app);

  assert.deepEqual(
    commands.map(({ name }) => name),
    ["/aarav-ping", "/aarav-help"],
  );
  assert.equal(new Set(commands.map(({ name }) => name)).size, commands.length);
  assert.deepEqual(events.map(({ name }) => name), ["app_mention"]);
  assert.ok(commands.every(({ handler }) => typeof handler === "function"));
  assert.ok(events.every(({ handler }) => typeof handler === "function"));
});
