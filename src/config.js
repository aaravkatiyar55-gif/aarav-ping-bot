function requireSlackToken(environment, name, expectedPrefix) {
  const value = environment[name];

  if (!value || value.includes("your-") || !value.startsWith(expectedPrefix)) {
    throw new Error(
      `${name} missing ya invalid hai; ${expectedPrefix} se start hone wali value chahiye.`,
    );
  }

  return value;
}

function readOptionalPort(environment) {
  if (!environment.PORT) {
    return null;
  }

  const port = Number(environment.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT 1 se 65535 ke beech valid integer hona chahiye.");
  }

  return port;
}

function readConfig(environment = process.env) {
  return {
    appToken: requireSlackToken(environment, "SLACK_APP_TOKEN", "xapp-"),
    botToken: requireSlackToken(environment, "SLACK_BOT_TOKEN", "xoxb-"),
    port: readOptionalPort(environment),
  };
}

module.exports = { readConfig, readOptionalPort };
