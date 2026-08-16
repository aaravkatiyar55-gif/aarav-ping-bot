const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { SLASH_COMMANDS } = require("../src/register");

test("Slack manifest code ke commands, event aur scopes se match karta hai", () => {
  const manifestPath = path.resolve(__dirname, "..", "slack-app-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  assert.equal(manifest.settings.socket_mode_enabled, true);
  assert.deepEqual(manifest.settings.event_subscriptions.bot_events, ["app_mention"]);
  assert.deepEqual(
    manifest.features.slash_commands.map(({ command }) => command),
    SLASH_COMMANDS,
  );
  assert.deepEqual(
    [...manifest.oauth_config.scopes.bot].sort(),
    ["app_mentions:read", "channels:history", "chat:write", "commands"].sort(),
  );
});
