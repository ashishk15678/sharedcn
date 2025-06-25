#!/usr/bin/env node

const args: string[] = process.argv.slice(2);
if (args.length == 0) {
  //   console.error("Usage : npx cli add <link>");
  console.error("Usage : npx cli add <link-of-the-component>");
}

if (args[0] == "add") {
  console.log("Wanna add a component ?");
} else {
}
