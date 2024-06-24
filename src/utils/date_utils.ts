import { exec } from 'child_process';
import chalk from 'chalk';

// functions

export async function getDate(arg: string) {
  // https://www.shell-tips.com/linux/how-to-format-date-and-time-in-linux-macos-and-bash/#how-to-format-a-date-in-bash
  if (arg.match(/^\d+[SMHdwmy]$/) === null) throw invalidDateError;
  return new Promise<string>((resolve, reject) => {
    exec(`date -v +${arg}`, (err, stdout, stderr) => (err ? reject(stderr.trim()) : resolve(stdout.trim())));
  });
}

// error messages

export const invalidDateError =
  'Invalid date format. Use date command syntax. e.g. 30M, 2H, 3d, 1w, etc. All values will be assumed positive.';

export function dateError(err: string) {
  err.split('\n').forEach((line) => console.error(`${chalk.redBright('ERR!')} ${line}`));
}
