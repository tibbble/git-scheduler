import { exec, spawn } from 'child_process';
import { Command } from 'commander';
import chalk from 'chalk';
import { getDate, dateError } from '../../utils/date_utils.js';
import { emtpyVimMessageError, getVimMessage } from '../../utils/vim_utils.js';

// functions

async function executeCommand(command: string) {
  return new Promise<string>((resolve, reject) => {
    exec(command, (err, stdout, stderr) =>
      err ? reject(`${stdout.trim() ? `${stdout.trim()}\n` : ''}${stderr.trim()}`) : resolve(stdout.trim())
    );
  });
}

// function that will execute a command at a specific time
// 
// @param command: string
// @param date: string
// 
// uses 'at' command to schedule a command to be executed at a specific time
//

async function handleExecuteCommand(command: string, date: string) {
  return new Promise<string>((resolve, reject) => {
    
  });
}


// COMMANDER command object

type CommitOptions = {};

const commandDescription = 'Creates a scheduled command to push the current commits to the repository.';

export const push = new Command('push').description(commandDescription).action(async () => {
  const remote = await executeCommand('git remote').catch(console.error);
  const date = await executeCommand('git log -1 --format=%ad').catch(console.error);
  const sha = await executeCommand ('git log -1 --format=%H').catch(console.error);
  const branch = await executeCommand('git rev-parse --abbrev-ref --symbolic-full-name @{u}').catch(console.error);
  console.log(`git push ${remote} ${sha}:${branch}`);
});

// git remote
// git log -1 --format=%ad
// git rev-parse --abbrev-ref --symbolic-full-name @{u}
// git push <remotename> <commit SHA>:<remotebranchname>
