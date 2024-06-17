import { Argument, Command, Option } from 'commander';

// not started at all

export const list = new Command('list')
  .description('List all scheduled commits')
  .argument('[message]', 'string message')
  .argument('[words...]', 'rest')
  .option('-m, --message', 'log hello')
  .option('-l', 'log lots')
  .option('-r', 'log random')
  .option('-q', 'log quiet')
  .action((message, words, options) => {
    console.log('list command called');
    console.log(message);
    console.log(words);
    console.log(options);

    // exec(`git commit ${files.join(" ")}`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    //   console.error(`stderr: ${stderr}`);
    // })
  });
