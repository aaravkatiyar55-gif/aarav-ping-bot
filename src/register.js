const {
  handleAppMention,
  handleHelpCommand,
  handlePingCommand,
} = require("./handlers");

const SLASH_COMMANDS = Object.freeze(["/aarav-ping", "/aarav-help"]);

function registerBotHandlers(app) {
  app.command(SLASH_COMMANDS[0], handlePingCommand);
  app.command(SLASH_COMMANDS[1], handleHelpCommand);
  app.event("app_mention", handleAppMention);
}

module.exports = { registerBotHandlers, SLASH_COMMANDS };
