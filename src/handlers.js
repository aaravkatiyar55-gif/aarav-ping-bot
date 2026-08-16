const PONG_MESSAGE = "Pong";
const MENTION_MESSAGE = "Pong 👋";
const HELP_MESSAGE = [
  "Aarav Ping Bot functions:",
  "• /aarav-ping — bot ka Pong check",
  "• /aarav-help — yeh function list",
  "• @Aarav Ping Bot mention — thread mein reply",
].join("\n");

async function handlePingCommand({ ack, respond, logger }) {
  await ack();

  try {
    await respond(PONG_MESSAGE);
  } catch (error) {
    logger.error(`/aarav-ping ka response send nahi hua: ${error.message}`);
  }
}

async function handleHelpCommand({ ack, respond, logger }) {
  await ack();

  try {
    await respond(HELP_MESSAGE);
  } catch (error) {
    logger.error(`/aarav-help ka response send nahi hua: ${error.message}`);
  }
}

async function handleAppMention({ event, say, logger }) {
  try {
    await say({
      text: MENTION_MESSAGE,
      thread_ts: event.thread_ts || event.ts,
    });
  } catch (error) {
    logger.error(`Mention ka response send nahi hua: ${error.message}`);
  }
}

module.exports = {
  HELP_MESSAGE,
  MENTION_MESSAGE,
  PONG_MESSAGE,
  handleAppMention,
  handleHelpCommand,
  handlePingCommand,
};
