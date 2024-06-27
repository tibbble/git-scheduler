import chalk from 'chalk';
import { Command } from 'commander';
import { spawn } from 'child_process';

function executeAdd(files: string[]) {
  return new Promise<void>((resolve, reject) => {
    const term = spawn('git', ['add', ...files], { stdio: 'inherit' });
    term.on('exit', (code) => (code === 0 ? resolve() : reject()));
  });
}

const commandDescription = `Add files to staging, identical to \`git add\`.
If you would like to use any command options or other complex usage, you are likely better off using \`git add\` directly.`;

export const add = new Command('add')
  .description(commandDescription)
  .argument('<files...>', 'specify the files to add to the staging area')
  .action((files) => {
    executeAdd(files)
      .then(() => console.log(`${chalk.greenBright('Files added to staging.')}`))
      .catch(() => console.error(`${chalk.redBright('ERR!')} Failed to add files to staging.`));
  });
