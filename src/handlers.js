const PONG_MESSAGE = "Pong";
const MENTION_MESSAGE = "Pong 👋";

async function handlePingCommand({ ack, respond, logger }) {
  await ack();

  try {
    await respond(PONG_MESSAGE);
  } catch (error) {
    logger.error(`/aarav-ping ka response send nahi hua: ${error.message}`);
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
  MENTION_MESSAGE,
  PONG_MESSAGE,
  handleAppMention,
  handlePingCommand,
};
