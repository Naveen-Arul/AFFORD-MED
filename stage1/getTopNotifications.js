const axios = require("axios");
const path = require("path");
const fs = require("fs");
const Log = require("../logging-middleware");
const { priorityScore } = require("./priorityHelper");

// Usage:
// ACCESS_TOKEN=... node getTopNotifications.js --top=10
// or
// node getTopNotifications.js --token="<token>" --top=10

function readArg(name) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return null;
  return arg.split("=")[1];
}

async function loadToken() {
  // Priority: explicit --token, env ACCESS_TOKEN, backend .env
  const tokenArg = readArg("token");
  if (tokenArg) return tokenArg;
  if (process.env.ACCESS_TOKEN) return process.env.ACCESS_TOKEN;

  // Try to read notification_app_be/.env if present
  try {
    const envPath = path.resolve(__dirname, "..", "notification_app_be", ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const m = content.match(/ACCESS_TOKEN=(.+)/);
      if (m) return m[1].trim();
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function fetchNotifications(token) {
  const url = "http://4.224.186.213/evaluation-service/notifications";
  Log("stage1", "info", "service", `Fetching notifications from ${url}`);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get(url, { headers, timeout: 10000 });
  // API may return { notifications: [...] } or an array directly
  const data = res.data;
  return data.notifications || data || [];
}

async function main() {
  const topN = Number(readArg("top") || 10);
  const token = await loadToken();
  // expose token to logging middleware (Log reads process.env.ACCESS_TOKEN when no token arg provided)
  if (token) process.env.ACCESS_TOKEN = token;
  if (!token) {
    console.error("ACCESS_TOKEN not provided. Set ACCESS_TOKEN env var or pass --token=...");
    Log("stage1", "error", "service", "Missing access token for notifications API");
    process.exit(1);
  }

  try {
    const notifications = await fetchNotifications(token);
    Log("stage1", "info", "service", `Fetched ${notifications.length} notifications`);

    const scored = notifications.map((n) => ({
      score: priorityScore(n),
      notification: n,
    }));

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topN).map((s) => s.notification);

    Log("stage1", "info", "service", `Top ${topN} notifications calculated`);

    console.log(`Top ${topN} notifications:`);
    top.forEach((n, i) => {
      console.log(`\n#${i + 1}`);
      console.log(JSON.stringify(n, null, 2));
    });

    // Save output for screenshot convenience
    const outPath = path.resolve(__dirname, "output_stage1.json");
    fs.writeFileSync(outPath, JSON.stringify(top, null, 2));
    console.log(`\nSaved top ${topN} to ${outPath}`);
  } catch (err) {
    Log("stage1", "error", "service", `Failed to fetch or process notifications: ${err.message}`);
    console.error("Error:", err.message || err);
    process.exit(1);
  }
}

main();
