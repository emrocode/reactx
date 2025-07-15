import os from "os";

const isWindows = os.platform() === "win32";

// Check if command exists
export async function hasCmd(cmd) {
  try {
    isWindows ? await $`where ${cmd}` : await $`command -v ${cmd}`;

    await $`${cmd} --version`;
    return true;
  } catch {
    return false;
  }
}
