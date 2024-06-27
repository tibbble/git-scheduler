import chalk from 'chalk';
import { Command } from 'commander';
import { spawn } from 'child_process';

function executeStatus() {
  return new Promise<void>((resolve, reject) => {
    const term = spawn('git', ['status'], { stdio: 'inherit' });
    term.on('exit', (code) => (code === 0 ? resolve() : reject()));
  });
}

const commandDescription = `Display the status of the working directory and the staging area, identical to \`git status\`.`;

export const status = new Command('status').description(commandDescription).action(() =>
  executeStatus()
    .then(() => {
      console.log(
        `${chalk.greenBright('Use "gsched add" and/or "gsched commit" to manage your changes.')}`
      );
    })
    .catch(() => console.error(`${chalk.redBright('ERR!')} Failed to execute status report.\n`))
);
