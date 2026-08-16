# Aarav Ping Bot

Yeh beginner-friendly Node.js Slack Bolt bot Socket Mode use karta hai.

- `/aarav-ping` ka reply: `Pong`
- `/aarav-help` bot ke available functions dikhata hai
- `@Aarav Ping Bot` mention ka threaded reply: `Pong 👋`
- Koi fake logged hours, rewards, tracking, database, ya user-data storage nahi hai.

Mission ke liye teen distinct functions hain: ping command, help command, aur mention reply. Dono slash commands `aarav-` prefix use karte hain, isliye generic `/ping` ya `/help` names se collision nahi hota.

## Project structure

```text
aarav-ping-bot/
├── scripts/doctor.js   # Token-free readiness checks
├── src/
│   ├── app.js          # Slack connection, startup aur graceful shutdown
│   ├── config.js       # Environment validation
│   ├── handlers.js     # Command aur mention logic
│   ├── health.js       # Optional GET /healthz endpoint
│   └── register.js     # Bolt listeners ko ek jagah register karta hai
├── test/               # Node ke built-in offline tests
├── .env.example        # Placeholders only
├── .gitignore          # Real .env ko ignore karta hai
├── .wakatime-project   # Hackatime activity ko isi repo name se isolate karta hai
├── package-lock.json   # Reproducible dependency versions
├── package.json
└── slack-app-manifest.json # Reviewable Slack app configuration
```

## Requirements

- Node.js 20.12 ya newer
- Existing Slack app: **Aarav Ping Bot**
- Socket Mode enabled
- Existing bot scopes exactly: `chat:write`, `commands`, `app_mentions:read`, `channels:history`
- Hosting ke liye normal long-running Node.js process aur outbound WebSocket support

Serverless request-only function is bot ke liye suitable nahi hai, kyunki Socket Mode process ko continuously connected rehna hota hai.

## Commands

| Command | Kaam |
| --- | --- |
| `npm ci --ignore-scripts` | Lockfile se exact dependencies install karta hai; lifecycle scripts nahi chalata |
| `npm run doctor` | Required files, lock alignment aur secret safeguards check karta hai |
| `npm run check` | Saari JavaScript files ka syntax check karta hai |
| `npm test` | Synthetic data se config, handlers aur health endpoint test karta hai |
| `npm run verify` | Doctor + syntax + tests ek saath chalata hai |
| `npm run start:local` | Local `.env` ke saath bot start karta hai |
| `npm start` | Host-injected environment variables ke saath bot start karta hai |
| `npm run dev` | Local `.env` load karke file changes par restart karta hai |

## Owner checklist: local setup aur live Slack test

Yeh steps owner ko apne trusted terminal/editor mein khud karne hain.

### 1. Node version check karo

```powershell
node --version
npm --version
```

Node output `v20.12.0` ya newer hona chahiye.

### 2. Exact locked dependencies install karo

```powershell
npm ci --ignore-scripts
```

`package-lock.json` project ka part hai. Normal setup mein `npm install` ke bajay `npm ci` use karo, taaki versions silently change na hon.

### 3. Local secret file banao

```powershell
Copy-Item .env.example .env
```

`.env` ko trusted local editor mein kholo aur dono placeholders owner ke real values se replace karo. Tokens chat, screenshots, README, GitHub, command arguments, ya logs mein kabhi paste mat karo.

```dotenv
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_APP_TOKEN=xapp-your-app-token-here
```

Safety check:

```powershell
git check-ignore .env
git status --short
```

Expected: pehla command `.env` print kare. `git status` mein `.env` appear nahi honi chahiye. Agar folder Git repository nahi hai, `.gitignore` safeguard phir bhi ready hai; Git initialize/push karna separate owner decision hai.

### 4. Saare non-secret local checks chalao

```powershell
npm run verify
```

Expected: doctor passes, syntax errors zero, aur saare tests pass.

### 5. Existing Slack dashboard ko manually verify karo

Project ne koi external Slack setting change nahi ki. Owner dashboard mein sirf verify kare:

1. Socket Mode enabled hai.
2. Event Subscriptions mein bot event `app_mention` subscribed hai.
3. Slash Commands mein exact `/aarav-ping` aur `/aarav-help` commands configured hain.
4. Bot Hack Club workspace aur test channel mein available/invited hai.
5. Bot scopes exactly `chat:write`, `commands`, `app_mentions:read`, `channels:history` hain.

Socket Mode mein public Slack Request URL ki zaroorat nahi hoti. App-level Socket Mode token ka management owner-only hai.

### 6. Local live test owner khud kare

```powershell
npm run start:local
```

`Aarav Ping Bot Socket Mode mein ready hai` log aane ke baad:

1. Slack mein `/aarav-ping` run karo → expected `Pong`.
2. Slack mein `/aarav-help` run karo → expected function list.
3. Test channel mein `@Aarav Ping Bot hello` bhejo → expected threaded `Pong 👋`.
4. Terminal mein `Ctrl+C` dabao → safe shutdown logs expected hain.

Yeh live test tokens aur Hack Club Slack access use karta hai, isliye owner-only hai. Is repository preparation mein yeh test run nahi hua.

## Provider-agnostic hosting readiness plan

Koi provider select ya configure nahi kiya gaya. Owner jo host choose kare, usmein yeh capabilities verify kare:

1. **Runtime:** Node.js `>=20.12` aur continuously running worker/process.
2. **Network:** outbound HTTPS/WebSocket connection Slack tak allowed ho.
3. **Install command:** `npm ci --ignore-scripts --omit=dev`.
4. **Start command:** `npm start`.
5. **Secret manager:** `SLACK_BOT_TOKEN` aur `SLACK_APP_TOKEN` ko host ke encrypted environment-variable UI mein owner khud add kare. `.env` upload/commit na kare.
6. **Health check:** host `PORT` environment variable deta hai to path `GET /healthz` set kare. Slack connection ready hone par `200 {"status":"ready"}` milega; startup mein `503` mil sakta hai.
7. **Process monitoring:** start log, unexpected exit/restart count, aur Slack connection errors monitor kare. Secret values logs mein kabhi nahi aani chahiye.
8. **Initial scale:** first live test ke liye ek instance/process se start karo, taaki behavior simple aur predictable rahe.
9. **Always-on policy:** host sleep/idle suspend karta ho to Socket Mode disconnect ho sakta hai; hosting limits pehle verify karo.

Host par `.env` file usually nahi banani chahiye. `npm start` already host-injected environment variables read karta hai. Local machine ke liye hi `npm run start:local` use karo.

Hackatime `.wakatime-project` ko project detection mein highest priority deta hai, isliye is repo ki new coding activity `aarav-ping-bot` naam se alag record honi chahiye. Stardance mein koi aur Hackatime project link mat karo.

### Owner deployment sequence

1. Local `npm run verify` green karo.
2. Local owner-run Slack smoke test green karo.
3. Chosen host ki current official docs se long-running process, outbound WebSocket, secrets, health check aur rollback support verify karo.
4. Code ko owner-approved repository/source se host par connect karo.
5. Install/start commands aur two secret variables configure karo.
6. Deploy action owner khud confirm kare.
7. Host logs mein ready status aur `/healthz` 200 verify karo.
8. Slack command aur mention smoke test repeat karo.
9. Failure ho to deployment stop karke previous known-good host release ko provider ke documented rollback UI/process se restore karo. Generic destructive rollback command assume mat karo.

## Startup aur health behavior

- Missing, placeholder, ya wrong-prefix token par process concise error ke saath non-zero exit code deta hai; token value print nahi hoti.
- Optional invalid `PORT` par startup fail hota hai.
- `/healthz` sirf `PORT` set hone par start hota hai; doosre paths `404` dete hain.
- `SIGINT`/`SIGTERM` par health readiness band hoti hai, HTTP server close hota hai, phir Slack app gracefully stop hota hai.
- HTTP health endpoint Slack events receive nahi karta; events Socket Mode WebSocket se aate hain.

## Common problems

- **Environment variable missing/invalid:** variable names aur `xoxb-`/`xapp-` type locally check karo; value share mat karo.
- **Slash command not found:** Slack dashboard ke Slash Commands page mein exact name verify karo.
- **Mention reply nahi aata:** `app_mention` event subscription aur channel membership verify karo.
- **`missing_scope`:** four expected bot scopes compare karo. Reinstall/change external Slack app owner/admin action hai.
- **Host repeatedly sleeps/restarts:** host ko long-running worker aur always-on runtime support karna chahiye.
- **Health check 503:** Slack Socket Mode connection abhi ready nahi hai; sanitized logs inspect karo.

## Security boundaries

- Source code aur lockfile mein real Slack secrets nahi hone chahiye.
- `.env` aur `.env.*` ignored hain; `.env.example` intentionally allowed hai.
- Health response secret, workspace, channel, ya user data expose nahi karta.
- Bot incoming text ko execute/evaluate nahi karta aur messages persist nahi karta.
- Token leak ka doubt ho to owner Slack dashboard se token rotate/revoke kare. Git se file delete karna token ko safe nahi banata.
- Deployment, Slack setting changes, token entry, live Slack testing, repository push, aur Stardance submission owner-only actions hain.

## Official references

- [Slack Bolt slash commands](https://docs.slack.dev/tools/bolt-js/concepts/commands/): command listener ko jaldi `ack()` karke `respond()` use karna chahiye.
- [Slack Bolt events](https://docs.slack.dev/tools/bolt-js/concepts/event-listening/): `app.event("app_mention", ...)` subscribed event receive karta hai.
- [Slack Bolt Socket Mode](https://docs.slack.dev/tools/bolt-js/concepts/socket-mode): `socketMode: true` aur app-level token public request URL ke bina WebSocket connection banate hain.
- [Slack app manifest reference](https://docs.slack.dev/reference/app-manifest/): repository ka `slack-app-manifest.json` commands, scopes, events, aur Socket Mode configuration document karta hai.
- [WakaTime CLI project detection](https://github.com/wakatime/wakatime-cli/blob/develop/USAGE.md#project-detection): `.wakatime-project` detected Git/IDE project name ko override karta hai.
