import os from "os";
import { execa } from "execa";

const isWindows = os.platform() === "win32";

// Check if command exists
export async function hasCmd(cmd) {
  try {
    isWindows
      ? await execa({ shell: true })`where ${cmd}`
      : await execa({ shell: true })`command -v ${cmd}`;

    await execa({ shell: true })`${cmd} --version`;
    return true;
  } catch {
    return false;
  }
}

// Run available commands
// Install mode: { i: true }
export async function runCommands({ pm, mode, dir }) {
  const title = mode.i
    ? "Installing dependencies"
    : `🚀 Cloning @reactx template into "${dir}"`;

  const commands = {
    npm: ["exec", "degit", "emrocode/reactx#main", `./${dir}`],
    pnpm: ["dlx", "degit", "emrocode/reactx#main", `./${dir}`],
    yarn: ["dlx", "degit", "emrocode/reactx#main", `./${dir}`],
    bun: ["x", "degit", "emrocode/reactx#main", `./${dir}`],
  };

  const args = commands[pm];

  await spinner(title, async () => {
    mode.i
      ? await execa({ shell: true })`cd ./${dir} && ${pm} install`
      : await execa({ shell: true })`${pm} ${args}`;
  });
}
