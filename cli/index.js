#!/usr/bin/env node

function getHost() {
  // Priority: env > config > default
  if (process.env.SHAREDCN_HOST) return process.env.SHAREDCN_HOST;
  try {
    const configPath = path.join(os.homedir(), ".sharedcn", "config.json");
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (data.host) return data.host;
    }
  } catch {}
  // return "http://localhost:3000";
  return "http://sharedcn.vercel.app";
}
const HOST = getHost();

import fs from "fs";
import path from "path";
import chalk from "chalk";
import { exec } from "child_process";
import os from "os";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(chalk.cyan("\nUsage:"));
  console.log(chalk.yellow("  npx sharedcn add <link-of-the-component>"));
  console.log(chalk.yellow("  npx sharedcn push <path-to-json-file>"));
  process.exit(1);
}

// Cross-platform config path
const CONFIG_DIR = path.join(os.homedir(), ".sharedcn");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function setupAuthToken(token) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ token }), "utf-8");
  console.log(chalk.green("[SUCCESS] Auth token saved!"));
}

function getAuthToken() {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    return data.token;
  } catch {
    return null;
  }
}

(async () => {
  switch (args[0]) {
    case "add": {
      // Usage: npx sharedcn add <alias1> <alias2> ... [--without-auth]
      const aliases = [];
      let withoutAuth = false;
      for (let i = 1; i < args.length; ++i) {
        if (args[i] === "--without-auth") withoutAuth = true;
        else if (!args[i].startsWith("--")) aliases.push(args[i]);
      }
      if (aliases.length === 0) {
        console.log(
          chalk.red(
            "[ERROR] Please provide at least one alias of the component to fetch."
          )
        );
        process.exit(1);
      }
      let token = null;
      if (!withoutAuth) token = getAuthToken();
      let spinner = startSpinner("Fetching component(s)...");
      try {
        const comps = await fetchComponentByAlias(aliases, token);
        stopSpinner(spinner);
        if (!Array.isArray(comps) || comps.length === 0) {
          console.log(
            chalk.red(
              `[ERROR] No components found for aliases: ${aliases.join(", ")}`
            )
          );
          process.exit(1);
        }
        let found = 0;
        const failedInstalls = [];
        const notExist = [];
        const installedDeps = new Set();
        for (const comp of comps) {
          if (comp.error) {
            notExist.push(comp.alias);
            console.log(chalk.red(`[ERROR] ${comp.alias}: ${comp.error}`));
            continue;
          }
          found++;
          const aliasDir = path.join(
            process.cwd(),
            "components",
            "custom",
            comp.alias
          );
          fs.mkdirSync(aliasDir, { recursive: true });
          if (Array.isArray(comp.code)) {
            for (const fileObj of comp.code) {
              const outPath = path.join(aliasDir, fileObj.filename);
              fs.writeFileSync(outPath, fileObj.code, "utf-8");
              console.log(
                chalk.green(
                  `Created: components/custom/${comp.alias}/${fileObj.filename}`
                )
              );
            }
          }
          // Install dependencies
          if (comp.dependent) {
            let deps = comp.dependent;
            if (typeof deps === "string")
              deps = deps.split(/\s+/).filter(Boolean);
            if (Array.isArray(deps)) {
              for (const dep of deps) {
                if (installedDeps.has(dep)) continue;
                try {
                  await installDependency(dep);
                  installedDeps.add(dep);
                  console.log(chalk.blue(`Installed: ${dep}`));
                } catch (e) {
                  failedInstalls.push({
                    alias: comp.alias,
                    dep,
                    error: e.message || e,
                  });
                  console.log(
                    chalk.red(
                      `Failed to install ${dep} for ${comp.alias}: ${
                        e.message || e
                      }`
                    )
                  );
                }
              }
            }
          }
          console.log(
            chalk.green(`[SUCCESS] Component fetched: ${comp.alias}`)
          );
        }
        if (found === 0) {
          console.log(chalk.red(`[ERROR] No valid components fetched.`));
          process.exit(1);
        }
        // Summary
        if (notExist.length > 0) {
          console.log(chalk.yellow("\nComponents that do not exist:"));
          notExist.forEach((a) => console.log(chalk.yellow(`- ${a}`)));
        }
        if (failedInstalls.length > 0) {
          console.log(chalk.red("\nPackages that failed to install:"));
          failedInstalls.forEach((f) =>
            console.log(chalk.red(`- ${f.dep} (for ${f.alias}): ${f.error}`))
          );
        }
      } catch (e) {
        stopSpinner(spinner);
        console.error(chalk.red("Error:"), e.message || e);
        process.exit(1);
      }
      break;
    }
    case "push": {
      // Usage: npx sharedcn push <file1> <file2> ... --name=... [--description=...] [--dependent=...] [--without-auth]
      const fileArgs = [];
      let name = null;
      let description = "";
      let dependent = [];
      let withoutAuth = false;
      for (let i = 1; i < args.length; ++i) {
        const arg = args[i];
        if (arg.startsWith("--name=")) {
          name = arg.slice(7).replace(/^['"]|['"]$/g, "");
        } else if (arg.startsWith("--description=")) {
          description = arg.slice(15).replace(/^['"]|['"]$/g, "");
        } else if (arg.startsWith("--dependent=")) {
          dependent = arg
            .slice(12)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (arg === "--without-auth") {
          withoutAuth = true;
        } else if (arg.startsWith("--")) {
          // ignore unknown flags
        } else {
          fileArgs.push(arg);
        }
      }
      if (!name) {
        console.log(
          chalk.red("[ERROR] --name is required for the component name.")
        );
        process.exit(1);
      }
      if (fileArgs.length === 0) {
        console.log(
          chalk.red(
            "[ERROR] Please provide at least one file for the component code."
          )
        );
        process.exit(1);
      }
      // Read all files
      let code = [];
      for (const file of fileArgs) {
        try {
          const absPath = path.isAbsolute(file)
            ? file
            : path.join(process.cwd(), file);
          const fileContent = fs.readFileSync(absPath, "utf-8");
          code.push({ filename: path.basename(file), code: fileContent });
        } catch (e) {
          console.log(
            chalk.red(`[ERROR] Failed to read file '${file}': ${e.message}`)
          );
          process.exit(1);
        }
      }
      // Build payload
      const componentData = { name, description, dependent, code };
      // Auth
      let token = null;
      if (!withoutAuth) {
        token = getAuthToken();
      }
      let spinner = null;
      spinner = startSpinner("Pushing component...");
      try {
        const comp = await fetchComponentAdd(componentData, token);
        stopSpinner(spinner);
        if (comp.error) {
          console.log(chalk.red(`[ERROR] ${comp.error}`));
          process.exit(1);
        }
        console.log(chalk.green(`[SUCCESS] Component pushed: ${comp.alias}`));
      } catch (e) {
        stopSpinner(spinner);
        console.error(chalk.red("Error:"), e.message || e);
        process.exit(1);
      }
      break;
    }
    case "setup-auth": {
      const token = args[1];
      if (!token) {
        console.log(chalk.red("[ERROR] Please provide an auth token."));
        process.exit(1);
      }
      // Validate token with API
      let spinner = startSpinner("Validating token with server...");
      try {
        const res = await fetch(`${HOST}/api/components/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, name: "token-validation" }),
        });
        stopSpinner(spinner);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.log(
            chalk.red(
              `[ERROR] Token validation failed: ${err.error || res.statusText}`
            )
          );
          process.exit(1);
        }
        // Save token cross-platform
        if (!fs.existsSync(CONFIG_DIR)) {
          fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        fs.writeFileSync(CONFIG_FILE, JSON.stringify({ token }), "utf-8");
        console.log(chalk.green("[SUCCESS] Auth token validated and saved!"));
      } catch (e) {
        stopSpinner(spinner);
        console.log(
          chalk.red(`[ERROR] Failed to validate token: ${e.message}`)
        );
        process.exit(1);
      }
      break;
    }
    default: {
      console.log(chalk.red("[ERROR] Unknown command:"), chalk.yellow(args[0]));
      console.log(chalk.cyan("\nUsage:"));
      console.log(chalk.yellow("  npx sharedcn add <link-of-the-component>"));
      console.log(chalk.yellow("  npx sharedcn push <path-to-json-file>"));
      console.log(chalk.yellow("  npx sharedcn setup-auth <token>"));

      process.exit(127);
    }
  }
})();

async function fetchComponentAdd(component, token) {
  const headers = { "Content-Type": "application/json" };
  const body = token ? { ...component, token } : component;
  const res = await fetch(`${HOST}/api/components/add`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errMsg = `HTTP error! status: ${res.status}`;
    try {
      const err = await res.json();
      if (err && err.error) errMsg = err.error;
    } catch {}
    throw new Error(errMsg);
  }
  return await res.json();
}

async function fetchComponents(components) {
  const comp = await fetch(`${HOST}/api/components/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(components),
  });
  if (!comp.ok) {
    throw new Error(`HTTP error! status: ${comp.status}`);
  }
  return await comp.json();
}

async function handleComponents(compArr) {
  const rootDir = process.cwd();
  const componentsDir = path.join(rootDir, "components");
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir);
  }
  const failedInstalls = [];
  const notExist = [];
  const installedDeps = new Set();

  for (const comp of compArr) {
    if (comp.error === "doesnot exist") {
      notExist.push(comp.alias);
      continue;
    }
    // Write component file
    const filePath = path.join(componentsDir, `${comp.alias}.jsx`);
    try {
      fs.writeFileSync(filePath, comp.code, "utf-8");
      console.log(chalk.green(`Created: components/${comp.alias}.jsx`));
    } catch (e) {
      console.log(chalk.red(`Failed to write file for ${comp.alias}: ${e}`));
    }
    // Install dependencies
    if (comp.dependent) {
      const deps = comp.dependent.split(/\s+/).filter(Boolean);
      for (const dep of deps) {
        if (installedDeps.has(dep)) continue;
        try {
          await installDependency(dep);
          installedDeps.add(dep);
          console.log(chalk.blue(`Installed: ${dep}`));
        } catch (e) {
          failedInstalls.push({
            alias: comp.alias,
            dep,
            error: e.message || e,
          });
          console.log(
            chalk.red(
              `Failed to install ${dep} for ${comp.alias}: ${e.message || e}`
            )
          );
        }
      }
    }
  }
  // Summary
  if (notExist.length > 0) {
    console.log(chalk.yellow("\nComponents that do not exist:"));
    notExist.forEach((a) => console.log(chalk.yellow(`- ${a}`)));
  }
  if (failedInstalls.length > 0) {
    console.log(chalk.red("\nPackages that failed to install:"));
    failedInstalls.forEach((f) =>
      console.log(chalk.red(`- ${f.dep} (for ${f.alias}): ${f.error}`))
    );
  }
}

function installDependency(dep) {
  return new Promise((resolve, reject) => {
    exec(`npm install ${dep}`, { stdio: "ignore" }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(true);
    });
  });
}

function startSpinner(text) {
  const spinnerChars = ["|", "/", "-", "\\"];
  let i = 0;
  process.stdout.write(text + " ");
  const interval = setInterval(() => {
    process.stdout.write("\b" + spinnerChars[i++ % spinnerChars.length]);
  }, 100);
  return interval;
}

function stopSpinner(interval) {
  if (interval) clearInterval(interval);
  process.stdout.write("\b ");
}

async function fetchComponentByAlias(aliases, token) {
  // Accepts an array of aliases
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${HOST}/api/components/fetch`, {
    method: "POST",
    headers,
    body: JSON.stringify(aliases),
  });
  if (!res.ok) {
    let errMsg = `HTTP error! status: ${res.status}`;
    try {
      const err = await res.json();
      if (err && err.error) errMsg = err.error;
    } catch {}
    throw new Error(errMsg);
  }
  return await res.json(); // Returns an array
}
