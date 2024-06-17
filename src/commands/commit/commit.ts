import { exec, spawn } from 'child_process';
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';

// functions

async function getDate(arg: string) {
  // https://www.shell-tips.com/linux/how-to-format-date-and-time-in-linux-macos-and-bash/#how-to-format-a-date-in-bash
  if (arg.match(/^[+]\d+[SMHdwmy]$/) === null) throw invalidDateError;
  return new Promise<string>((resolve, reject) => {
    exec(`date -v ${arg}`, (err, stdout, stderr) => (err ? reject(stderr.trim()) : resolve(stdout.trim())));
  });
}

async function getVimMessage() {
  const tempFile = `./vimMessageFile.txt`;
  const term = spawn('vim', [tempFile], { stdio: 'inherit' });
  return new Promise<string>((resolve, reject) => {
    term.on('exit', () => {
      try {
        const commit_message = fs.readFileSync(tempFile, 'utf8');
        fs.unlinkSync(tempFile);
        resolve(commit_message.trim());
      } catch {
        reject();
      }
    });
  });
}

async function handleExecuteCommit(message: string, date?: string) {
  return new Promise<string>((resolve, reject) => {
    const command = `git commit -m "${message.trim()}"`;
    const options = { env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } };
    exec(command, options, (err, stdout, stderr) =>
      err ? reject(`${stdout.trim() ? `${stdout.trim()}\n` : ''}${stderr.trim()}`) : resolve(stdout.trim())
    );
  });
}

// error messages

const invalidDateError =
  'Invalid date format. Use date command syntax. e.g. +30M, +2H, +3d, +1w, etc. Ensure that all values are positive.';

function dateError(err: string) {
  err.split('\n').forEach((line) => console.error(`${chalk.redBright('ERR!')} ${line}`));
}

function emtpyVimMessageError() {
  console.log(`${chalk.redBright('ERR!')} Provide a commit message to perform this action.`);
  console.log(`${chalk.redBright('ERR!')} Nothing has been committed or changed.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
}

function commitError(err: string) {
  err.split('\n').forEach((line) => console.error(`${chalk.redBright('ERR!')} ${line}`));
  console.log(`${chalk.redBright('ERR!')} Commit failed.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
}

// COMMANDER command object

type CommitOptions = {
  message: string;
  fastForward: string;
};

export const commit = new Command('commit')
  .description('Commit your staged files to the repository.')
  .option('-m, --message <COMMIT MESSAGE>', 'add a message to the commit')
  .option(
    '-ff, --fast-forward <AMOUNT>',
    'specify the amount of time to fast forward to. uses date command syntax. e.g. +2H'
  )
  .action(async (options: CommitOptions) => {
    const commit_message =
      options.message || (await getVimMessage().catch(() => (emtpyVimMessageError(), process.exit(1))));
    const date =
      options.fastForward &&
      (await getDate(options.fastForward).catch((err: string) => (dateError(err), process.exit(1))));

    handleExecuteCommit(commit_message, date)
      .then(() => (console.log(`${chalk.greenBright('Commit executed.')}\n`), process.exit(0)))
      .catch((err) => (commitError(err), process.exit(1)));
  });
