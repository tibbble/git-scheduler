import { spawn } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';

// functions

export async function getVimMessage() {
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

// error messages

export function emtpyVimMessageError() {
  console.log(`${chalk.redBright('ERR!')} Provide a commit message to perform this action.`);
  console.log(`${chalk.redBright('ERR!')} Nothing has been committed or changed.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
}
