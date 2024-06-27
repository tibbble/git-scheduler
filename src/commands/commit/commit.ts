import { exec, spawn } from 'child_process';
import { Command } from 'commander';
import chalk from 'chalk';
import { getDate, dateError } from '../../utils/date_utils.js';
import { emtpyVimMessageError, getVimMessage } from '../../utils/vim_utils.js';

// functions

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

function commitError(err: string) {
  err.split('\n').forEach((line) => console.error(`${chalk.redBright('ERR!')} ${line}`));
  console.log(`${chalk.redBright('ERR!')} Commit failed.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
}

// COMMANDER command object

type CommitOptions = {
  message: string;
  past: boolean;
};

const commandDescription = `Commit your staged files to the repository with a custom date.
This command is intended to be used for creating commits a few hours or days in the past or future (default future).
The date will be set for both the author and committer of the commit.
${chalk.redBright(
  'NOTE: commits will be executed, not just scheduled. Any pushes to the repository will push all created commits.'
)}
${chalk.redBright('Take care not to push future commits to your repository if you are working in a team.')}`;

const commandArgumentDescription =
  'specifies a future time offset relative to the current datetime for your git commit. uses date command syntax. e.g. 2H';

export const commit = new Command('commit')
  .description(commandDescription)
  .argument('<COMMIT OFFSET>', commandArgumentDescription)
  .option('-m, --message <COMMIT MESSAGE>', 'add a message to the commit. if not provided, a vim editor will open')
  .option('-p, --past', 'indicate that the commit offset should be in the past. default is future.')
  .action(async (timeInterval, options: CommitOptions) => {
    const date = await getDate(timeInterval, options.past).catch((err: string) => (dateError(err), process.exit(1)));
    const commit_message =
      options.message || (await getVimMessage().catch(() => (emtpyVimMessageError(), process.exit(1))));

    handleExecuteCommit(commit_message, date)
      .then(() => (console.log(`${chalk.greenBright(`Commit executed for ${date}`)}\n`), process.exit(0)))
      .catch((err) => (commitError(err), process.exit(1)));
  });
