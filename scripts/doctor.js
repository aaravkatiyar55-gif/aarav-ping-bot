const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const requiredFiles = [
  ".env.example",
  ".gitignore",
  ".wakatime-project",
  "package.json",
  "package-lock.json",
  "src/app.js",
  "src/config.js",
  "src/handlers.js",
  "src/health.js",
  "src/register.js",
  "slack-app-manifest.json",
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 12)) {
  fail("Node.js 20.12 ya newer chahiye.");
} else {
  console.log(`PASS: Node.js ${process.versions.node} supported hai.`);
}

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(projectRoot, relativePath))) {
    fail(`${relativePath} missing hai.`);
  }
}

const ignoreRules = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8");
if (!/^\.env$/m.test(ignoreRules) || !/^!\.env\.example$/m.test(ignoreRules)) {
  fail(".env ignore rule ya .env.example allow rule missing hai.");
} else {
  console.log("PASS: .env Git ignore safeguard present hai.");
}

const example = fs.readFileSync(path.join(projectRoot, ".env.example"), "utf8");
if (
  !example.includes("SLACK_BOT_TOKEN=xoxb-your-bot-token-here") ||
  !example.includes("SLACK_APP_TOKEN=xapp-your-app-token-here")
) {
  fail(".env.example mein expected safe placeholders missing hain.");
} else {
  console.log("PASS: .env.example mein placeholder-only Slack config hai.");
}

const trackedProjectName = fs
  .readFileSync(path.join(projectRoot, ".wakatime-project"), "utf8")
  .trim();
if (trackedProjectName !== "aarav-ping-bot") {
  fail(".wakatime-project ko exact aarav-ping-bot project isolate karna chahiye.");
} else {
  console.log("PASS: Hackatime project identity aarav-ping-bot par isolated hai.");
}

const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(projectRoot, "package-lock.json"), "utf8"));

if (manifest.dependencies["@slack/bolt"] !== "4.2.1") {
  fail("@slack/bolt exact version par pinned nahi hai.");
} else if (lock.packages?.[""]?.dependencies?.["@slack/bolt"] !== "4.2.1") {
  fail("package.json aur package-lock.json dependency match nahi karte.");
} else {
  console.log("PASS: Slack Bolt manifest aur lockfile aligned hain.");
}

if (!process.exitCode) {
  console.log("Doctor complete: non-secret readiness checks pass hue.");
}
