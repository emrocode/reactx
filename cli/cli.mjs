#!/usr/bin/env node

import "zx/globals";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { hasCmd, runCommands } from "./helpers.mjs";

// Package manager detection and selection
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
  console.error(chalk.red("No supported package manager found."));
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

// Project setup, template and cloning
const argv = minimist(process.argv.slice(2), {});

let template = argv.template;

if (!template) {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select a template to use:",
      choices: [
        { name: "JavaScript", value: "js" },
        { name: "TypeScript", value: "ts" },
      ],
      default: "js",
    },
  ]);
  template = answers.template;
}

const dir = argv.dir || (await question("Project name? ")) || "reactx";
const targetPath = path.resolve(process.cwd(), dir);

if (fs.existsSync(targetPath)) {
  console.error(chalk.red(`Directory "${dir}" already exists!`));
  process.exit(1);
}

await runCommands({ pm: selectedPM, mode: { i: false }, dir, template });

// Dependency selection and package.json modification
const REQUIRED_DEPS = ["react", "react-dom", "react-router", "prop-types"];
const pkgPath = path.join(process.cwd(), `${dir}/package.json`);
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
newPkg.name = dir;
// Filter out unselected dependencies
newPkg.dependencies = Object.fromEntries(
  Object.entries(pkg.dependencies).filter(
    ([dep]) => REQUIRED_DEPS.includes(dep) || selectedPackages.includes(dep),
  ),
);

// Write new package.json
fs.writeFileSync(pkgPath, JSON.stringify(newPkg, null, 2));

// Install dependencies
await runCommands({ pm: selectedPM, mode: { i: true }, dir });

// Cleanup
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

// Completion message
console.log(chalk.green("✅ Installation complete!"));
