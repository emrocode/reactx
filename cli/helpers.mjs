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
