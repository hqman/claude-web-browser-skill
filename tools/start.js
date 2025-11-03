#!/usr/bin/env node

import { spawn, execSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const useProfile = process.argv[2] === "--profile";

if (process.argv[2] && process.argv[2] !== "--profile") {
  console.log("Usage: start.ts [--profile]");
  console.log("\nOptions:");
  console.log(
    "  --profile  Copy your default Chrome profile (cookies, logins)",
  );
  console.log("\nExamples:");
  console.log("  start.ts            # Start with fresh profile");
  console.log("  start.ts --profile  # Start with your Chrome profile");
  process.exit(1);
}

// Check if Chrome is already running on port 9222
let alreadyRunning = false;
try {
  const browser = await puppeteer.connect({
    browserURL: "http://localhost:9222",
    defaultViewport: null,
  });
  await browser.disconnect();
  alreadyRunning = true;
  console.log("✓ Chrome already running on :9222");
} catch {
  // Chrome not running, continue with startup
}

if (!alreadyRunning) {
  // Kill existing Chrome processes (just in case)
  try {
    execSync("killall 'Google Chrome'", { stdio: "ignore" });
  } catch {}

  // Wait a bit for processes to fully die
  await new Promise((r) => setTimeout(r, 1000));

  // Setup profile directory
  execSync("mkdir -p ~/.cache/scraping", { stdio: "ignore" });

  if (useProfile) {
    // Sync profile with rsync (much faster on subsequent runs)
    const homeDir = process.env.HOME;
    execSync(
      `rsync -a --delete "${homeDir}/Library/Application Support/Google/Chrome/" "${homeDir}/.cache/scraping/"`,
      { stdio: "pipe" },
    );
  }

  // Start Chrome in background (detached so Node can exit)
  spawn(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--remote-debugging-port=9222",
      `--user-data-dir=${process.env["HOME"]}/.cache/scraping`,
    ],
    { detached: true, stdio: "ignore" },
  ).unref();
}

// Wait for Chrome to be ready by attempting to connect (only if we just started it)
if (!alreadyRunning) {
  let connected = false;
  for (let i = 0; i < 30; i++) {
    try {
      const browser = await puppeteer.connect({
        browserURL: "http://localhost:9222",
        defaultViewport: null,
      });
      await browser.disconnect();
      connected = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!connected) {
    console.error("✗ Failed to connect to Chrome");
    process.exit(1);
  }

  console.log(
    `✓ Chrome started on :9222${useProfile ? " with your profile" : ""}`,
  );
}
