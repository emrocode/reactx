#!/usr/bin/env node

import "zx/globals";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { hasCmd } from "./helpers.mjs";

// ### Package manager detection and selection ###
const pmChecks = [
  { name: "npm", cmd: "npm" },
  { name: "pnpm", cmd: "pnpm" },
  { name: "yarn", cmd: "yarn" },
  { name: "bun", cmd: "bun" },
];

const foundPMs = [];

for (const pm of pmChecks) {
  if (await hasCmd(pm.cmd)) {
    foundPMs.push(pm.name);
  }
}

if (foundPMs.length === 0) {
  console.error(
    chalk.red(
      "No supported package manager found. Please install npm, yarn, or pnpm.",
    ),
  );
  process.exit(1);
}

let selectedPM = foundPMs[0];

if (foundPMs.length >= 1) {
  const { pm } = await inquirer.prompt([
    {
      type: "list",
      name: "pm",
      message: "Select a package manager to use:",
      choices: foundPMs,
      default: (foundPMs.includes("pnpm") && "pnpm") || foundPMs[0],
    },
  ]);
  selectedPM = pm;
}

console.log(chalk.yellow(`Using "${selectedPM}" as package manager.`));

// ### Project setup and cloning ###
const argv = minimist(process.argv.slice(2), {});
const projectName = argv.dir || (await question("Project name? ")) || "reactx";
const targetPath = path.resolve(process.cwd(), projectName);

if (fs.existsSync(targetPath)) {
  console.error(chalk.red(`Directory "${projectName}" already exists!`));
  process.exit(1);
}

console.log(chalk.blue(`🚀 Cloning Reactx template into "${projectName}"...`));

switch (selectedPM.length > 0) {
  case selectedPM === "npm":
    await $`npm exec degit emrocode/reactx#main ./${projectName}`;
    break;
  case selectedPM === "pnpm":
    await $`pnpm dlx degit emrocode/reactx#main ./${projectName}`;
    break;
  case selectedPM === "yarn":
    await $`yarn dlx degit emrocode/reactx#main ./${projectName}`;
    break;
  case selectedPM === "bun":
    await $`bun x degit emrocode/reactx#main ./${projectName}`;
    break;
}

// ### Dependency selection and package.json modification ###
const REQUIRED_DEPS = ["react", "react-dom", "react-router", "prop-types"];
const pkgPath = path.join(process.cwd(), `${projectName}/package.json`);
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
let allDeps = Object.keys(pkg.dependencies);

const selectableDeps = allDeps.filter((dep) => !REQUIRED_DEPS.includes(dep));
const { selectedPackages } = await inquirer.prompt([
  {
    type: "checkbox",
    name: "selectedPackages",
    message: "Select packages to install:",
    choices: selectableDeps,
    default: selectableDeps,
  },
]);

// Rewrite package.json
const newPkg = { ...pkg };

// Rename package.json
newPkg.name = projectName;
// Filter out unselected dependencies
newPkg.dependencies = Object.fromEntries(
  Object.entries(pkg.dependencies).filter(
    ([dep]) => REQUIRED_DEPS.includes(dep) || selectedPackages.includes(dep),
  ),
);

// Write new package.json
fs.writeFileSync(pkgPath, JSON.stringify(newPkg, null, 2));

// ### Install dependencies ###
await spinner("Installing dependencies...", async () => {
  switch (selectedPM.length > 0) {
    case selectedPM === "npm":
      await $`cd ${projectName} && npm install`;
      break;
    case selectedPM === "pnpm":
      await $`cd ${projectName} && pnpm install`;
      break;
    case selectedPM === "yarn":
      await $`cd ${projectName} && yarn install`;
      break;
    case selectedPM === "bun":
      await $`cd ${projectName} && bun install`;
      break;
  }
});

// ### Cleanup ###
// Remove unneeded files
const unneededFiles = ["pnpm-lock.yaml", "pnpm-workspace.yaml"];

if (selectedPM !== "pnpm") {
  let removed = [];
  for (const file of unneededFiles) {
    const filePath = path.join(targetPath, file);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true });
      removed.push(file);
    }
  }
  if (removed.length) {
    console.log(`🧹 Removed pnpm files: ${removed.join(", ")}`);
  }
}

// Remove unneded directories
const unneededDirs = [".github", "cli"];
let removedDirs = [];

for (const dir of unneededDirs) {
  const filePath = path.join(targetPath, dir);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true });
    removedDirs.push(dir);
  }
}

if (removedDirs.length) {
  console.log(`🧹 Removed (${removedDirs.join(", ")}) directories.`);
}

// ### Completion message ###
console.log(chalk.green("✅ Installation complete!"));
