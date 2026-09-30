# Aarav Ping Bot

A small Slack bot with three jobs: answer a ping, show its commands, and reply in a thread when mentioned. It uses Node.js and Slack Bolt's Socket Mode, so Slack events arrive over a WebSocket rather than a public webhook.

| Try in Hack Club Slack | Expected reply |
| --- | --- |
| `/aarav-ping` | `Pong` |
| `/aarav-help` | A short list of the bot's functions |
| `@Aarav Ping Bot hello` | `Pong 👋` in the same thread |

The `aarav-` prefix keeps the slash commands distinct from other bots. The bot does not save messages or run code from incoming text.

## Current state

The source, offline checks and Nest service setup are prepared. **The Nest bot is not running yet:** its app-level Socket Mode token still needs to be configured. A valid bot token alone is not enough. Live command and mention replies have not been verified for this release.

The selected host is the existing `aarav-ping-bot` Nest container. Its configured public address is `https://status.aarav-ping-bot.hackclub.app/`. Treat this as a deployment target until the service is connected and that exact URL has been checked.

## Run locally

Use Node.js 20.12 or newer and npm. From this repository:

```powershell
npm ci --ignore-scripts
Copy-Item .env.example .env
```

Fill the two placeholders in your local `.env` using tokens from the **same Slack app**:

- `SLACK_BOT_TOKEN`: bot token, beginning with `xoxb-`.
- `SLACK_APP_TOKEN`: app-level token, beginning with `xapp-`, with `connections:write` for Socket Mode.
- `PORT`: optional HTTP port for the public instruction page and health check.

Keep token values out of Git, screenshots, logs and command arguments. `.env` is ignored; `.env.example` contains only placeholders.

```powershell
npm run verify
npm run start:local
```

`verify` checks the project files, JavaScript syntax and offline tests. It does not connect to Slack. `start:local` loads `.env` and starts the actual bot. Press Ctrl+C to stop it cleanly.

## Slack app settings

The existing app manifest is in [slack-app-manifest.json](slack-app-manifest.json). Check that the installed app has:

- Socket Mode enabled and an app-level token with `connections:write`.
- Both `/aarav-ping` and `/aarav-help` slash commands.
- The `app_mention` bot event subscription.
- Existing bot scopes: `chat:write`, `commands`, `app_mentions:read`, `channels:history`.
- Membership in the channel where mention replies will be tested.

Do not add permissions just to make an error disappear. Compare the installed app with the manifest first.

## Nest deployment

[deploy/aarav-ping-bot.service](deploy/aarav-ping-bot.service) describes the existing service: code in `/opt/aarav-ping-bot`, dedicated `aaravbot` user, HTTP port 3000, and credentials in root-owned `/etc/aarav-ping-bot.env` with mode 600.

On the host, install the locked dependencies and run the offline checks as the service user. Once **both** tokens are configured, start the service and check it:

```sh
sudo systemctl start aarav-ping-bot
sudo systemctl is-active aarav-ping-bot
```

Do not start it repeatedly with incomplete credentials. A service manager can otherwise get stuck in a restart loop.

The HTTP page at `/` describes the real Slack functions and shows connection status at page load. `/healthz` returns `200 {"status":"ready"}` only while the Slack connection is active; otherwise it returns 503. Both responses avoid caching. The page is an instruction page, not a simulated Slack demo.

After deployment, test all three replies in an authorized Slack test conversation, then check a controlled stop/restart. HTTP health alone does not prove slash-command configuration or successful replies. For a rollback, stop the service, restore the previously recorded source commit, run the offline checks, and restart with the existing credentials.

## Where to change things

| File | Purpose |
| --- | --- |
| `src/handlers.js` | The three reply functions |
| `src/register.js` | Bolt command and event registration |
| `src/config.js` | Token and port validation |
| `src/app.js` | Connection lifecycle and shutdown |
| `src/health.js`, `src/demo.html` | Public page and readiness endpoint |
| `test/` | Synthetic tests using Node's built-in test runner |
| `.wakatime-project` | Keeps coding activity under `aarav-ping-bot` |

## If something fails

- **Command not found:** check the exact command names in the installed Slack app.
- **No mention reply:** check `app_mention` and channel membership.
- **Invalid token:** check token type and app identity privately; never paste the value into an issue.
- **503 health:** the Socket Mode connection is starting, reconnecting or stopped. Check sanitized service logs.
- **Idle host:** use a continuously running process with outbound WebSocket access. A request-only serverless function cannot keep this bot connected.

## Development and evidence

AI assistance was used for development, testing and documentation. Offline tests are separate from live Slack evidence. This repository makes no claim about logged hours, Stardance approval, rewards or compliance with an AI-percentage limit.

Useful references: [Bolt commands](https://docs.slack.dev/tools/bolt-js/concepts/commands/), [Bolt Socket Mode](https://docs.slack.dev/tools/bolt-js/concepts/socket-mode/), and [Socket Mode lifecycle](https://docs.slack.dev/tools/node-slack-sdk/socket-mode/).
