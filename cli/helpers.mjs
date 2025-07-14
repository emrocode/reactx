// Check if command exists
export async function hasCmd(cmd) {
  try {
    await $`${cmd} --version`;
    return true;
  } catch {
    return false;
  }
}
