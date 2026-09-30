const { readConfig } = require("./config");
const { close, createHealthServer, listen } = require("./health");
const { registerBotHandlers } = require("./register");

async function main() {
  const config = readConfig();
  const { App, LogLevel, SocketModeReceiver } = require("@slack/bolt");
  let ready = false;
  let stopping = false;

  const receiver = new SocketModeReceiver({
    appToken: config.appToken,
    logLevel: LogLevel.INFO,
  });
  const app = new App({ token: config.botToken, receiver, logLevel: LogLevel.INFO });

  receiver.client.on("connected", () => { ready = true; });
  for (const event of ["connecting", "reconnecting", "disconnecting", "disconnected"]) {
    receiver.client.on(event, () => { ready = false; });
  }

  registerBotHandlers(app);

  const healthServer = config.port
    ? createHealthServer({ isReady: () => ready && !stopping && receiver.client.websocket?.isActive() === true })
    : null;

  if (healthServer) {
    await listen(healthServer, config.port);
    console.log(`Health check port ${config.port} par available hai.`);
  }

  const shutdown = async (signal) => {
    if (stopping) return;
    stopping = true;
    ready = false;
    console.log(`${signal} mila; bot safely stop ho raha hai.`);
    await close(healthServer);
    await app.stop();
    console.log("Aarav Ping Bot safely stop ho gaya.");
  };

  process.once("SIGINT", () => shutdown("SIGINT").catch(handleFatalError));
  process.once("SIGTERM", () => shutdown("SIGTERM").catch(handleFatalError));

  try {
    await app.start();
    ready = true;
    console.log("⚡ Aarav Ping Bot Socket Mode mein ready hai.");
  } catch (error) {
    await close(healthServer);
    throw error;
  }
}

function handleFatalError(error) {
  console.error("Bot start ya stop nahi ho saka:", error.message);
  process.exitCode = 1;
}

main().catch(handleFatalError);
