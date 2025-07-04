import fs from "fs";
import path from "path";
import chalk from "chalk";
import crypto from "crypto";
import process from "process";
import os from "os";

function getHost() {
  if (process.env.SHAREDCN_HOST) return process.env.SHAREDCN_HOST;
  try {
    const configPath = path.join(os.homedir(), ".sharedcn", "config.json");
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (data.host) return data.host;
    }
  } catch {}
  return "http://localhost:3000";
}
const HOST = getHost();

export async function pushComponents(jsonPath, authToken) {
  if (!authToken) {
    console.log(
      chalk.red(
        "[AUTH ERROR] Auth token not found. Please run 'npx sharedcn setup-auth <token>' first."
      )
    );
    process.exit(1);
  }

  // Read and parse JSON file
  let data;
  try {
    const absPath = path.isAbsolute(jsonPath)
      ? jsonPath
      : path.join(process.cwd(), jsonPath);
    const fileContent = fs.readFileSync(absPath, "utf-8");
    data = JSON.parse(fileContent);
  } catch (e) {
    console.log(
      chalk.red(`[ERROR] Failed to read or parse JSON file: ${e.message}`)
    );
    process.exit(1);
  }

  // Validate structure: should be an array of components
  if (!Array.isArray(data)) {
    console.log(chalk.red("[ERROR] JSON root must be an array of components."));
    process.exit(1);
  }

  let validComponents = [];
  let errors = [];

  data.forEach((comp, idx) => {
    let err = [];
    // Required fields: name, description, code
    if (!comp.name || typeof comp.name !== "string")
      err.push("name (string) is required");
    if (!comp.description || typeof comp.description !== "string")
      err.push("description (string) is required");
    if (!comp.code || typeof comp.code !== "string")
      err.push("code (string) is required");
    // Optional: dependents (array of strings)
    if (comp.dependents && !Array.isArray(comp.dependents))
      err.push("dependents must be an array of strings");
    // All fields should be arrays if present (except name, description, code)
    Object.keys(comp).forEach((key) => {
      if (
        ["name", "description", "code", "dependents"].indexOf(key) === -1 &&
        !Array.isArray(comp[key])
      ) {
        err.push(`${key} must be an array if present`);
      }
    });
    if (err.length > 0) {
      errors.push({ idx, name: comp.name, errors: err });
      return;
    }
    // Generate unique id
    comp.id = crypto.randomUUID();
    validComponents.push(comp);
  });

  if (errors.length > 0) {
    console.log(chalk.red("\n[VALIDATION ERRORS]:"));
    errors.forEach((e) => {
      console.log(
        chalk.yellow(
          `Component at index ${e.idx}${e.name ? ` (name: ${e.name})` : ""}:`
        )
      );
      e.errors.forEach((msg) => console.log(chalk.red(`  - ${msg}`)));
    });
    process.exit(1);
  }

  // Push to server
  try {
    const res = await fetch(`${HOST}/api/components/push`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validComponents),
    });
    console.log(chalk.green("\n[SUCCESS] Components pushed successfully!"));
    if (Array.isArray(res.data)) {
      res.data.forEach((c, i) => {
        console.log(
          chalk.cyan(
            `- ${c.name || validComponents[i].name} (id: ${
              c.id || validComponents[i].id
            })`
          )
        );
      });
    }
  } catch (e) {
    console.log(chalk.red("[ERROR] Failed to push components:"));
    if (e.response && e.response.data) {
      console.log(chalk.red(JSON.stringify(e.response.data, null, 2)));
    } else {
      console.log(chalk.red(e.message));
    }
    process.exit(1);
  }
}
