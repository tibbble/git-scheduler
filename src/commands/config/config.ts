import { Command } from 'commander';
import { createInterface } from 'readline';
import Ajv, { ErrorObject } from 'ajv';
import chalk from 'chalk';
import fs from 'fs';
import { Config, configFilePath, configSchema, defaultConfig, configDescription } from '../../configuration/index.js';

// utility functions

function getUserConfirmation(confirmationMessage: string) {
  return new Promise<void>((resolve, reject) => {
    console.log(`${chalk.yellowBright('WARN!')} ${confirmationMessage}`);
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${chalk.yellowBright('WARN!')} Continue? (y/N) `, (data: string) => {
      rl.close();
      const answer = data.trim().toLowerCase();
      answer === 'y' || answer === 'yes' ? resolve() : reject();
    });
  });
}

function readConfig() {
  return new Promise<Config>((resolve, reject) => {
    try {
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
      resolve(config);
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

function writeFile(config?: Partial<Config>) {
  const configString = JSON.stringify(config ? { ...defaultConfig, ...config } : defaultConfig, null, 2);
  return new Promise<void>((resolve, reject) => {
    try {
      fs.writeFileSync(configFilePath, configString);
      resolve();
    } catch (error) {
      reject();
    }
  });
}

function validateSchema(config: Config) {
  return new Promise<void>((resolve, reject) => {
    const ajv = new Ajv();
    const validate = ajv.compile(configSchema);
    const valid = validate(config);
    valid ? resolve() : reject(validate.errors);
  });
}

// main functions

async function overwriteFile(props: { config?: Config; shouldConfirm?: boolean }) {
  if (fs.existsSync(configFilePath) && props.shouldConfirm) {
    await getUserConfirmation('This will overwrite the existing configuration file.').catch(unconfirmedOverwriteError);
  }
  return writeFile(props.config)
    .then(() => {
      console.log(chalk.greenBright('Configuration file reinitialized.\n'));
    })
    .catch(fileWriteError);
}

async function updateConfig(key: string, value: string) {
  return readConfig()
    .then(async (config) => {
      const newConfig = { ...config, [key]: value };
      validateSchema(newConfig)
        .then(() => {
          writeFile(newConfig)
            .then(async () => {
              console.log(chalk.greenBright(`Configuration updated.`));
              await displayCurrentConfig();
            })
            .catch(fileWriteError);
        })
        .catch((errors) => fileValidationError(errors, `Update failed for ${key}: ${value}`));
    })
    .catch(fileReadError);
}

async function displayCurrentConfig() {
  return readConfig()
    .then((config) => {
      console.log(JSON.stringify(config, null, 2) + '\n');
    })
    .catch(fileReadError);
}

function displayConfigDescription() {
  console.log(chalk.greenBright('Configuration description:'));
  console.log(configDescription);
  console.log();
}

// error messages

function unconfirmedOverwriteError() {
  console.log(`${chalk.redBright('ERR!')} Overwrite not authorized. Operation cancelled.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
  process.exit(1);
}

function fileWriteError() {
  console.log(`${chalk.redBright('ERR!')} Operation failed. File could not be written.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
  process.exit(1);
}

function fileReadError() {
  console.log(`${chalk.redBright('ERR!')} Configuration file not found.`);
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
  process.exit(1);
}

function fileValidationError(errors: ErrorObject[], message?: string) {
  message && console.log(`${chalk.redBright('ERR!')} ${message}`);
  console.log(`${chalk.redBright('ERR!')} Configuration object is invalid.`);
  console.log(`${chalk.redBright('ERR!')} Errors:`);
  console.log(chalk.redBright('ERR!'));
  errors.forEach((error) => {
    console.log(`${chalk.redBright('ERR!')}     ${error.message}`);
  });
  console.log(chalk.redBright('ERR!'));
  console.log(`${chalk.redBright('ERR!')} Exiting...\n`);
  process.exit(1);
}

// COMMANDER command object

type ConfigOptions = {
  reset: boolean;
  overwrite: boolean;
  update: [string, string];
  description: boolean;
};

export const config = new Command('config')
  .description('Manage the CLI configuration file.')
  .option('-r, --reset', 'Reinitialize the configuration file with default settings')
  .option('-o, --overwrite', 'Overwrite the existing configuration file without asking for confirmation')
  .option(
    '-u, --update <KEY> <VALUE...>',
    'Update the configuration file with new settings. Only specify one single key and value at a time.'
  )
  .option('-d, --description', 'Display the description of each configuration option')
  .action(async (options: ConfigOptions) => {
    if (Object.keys(options).length === 0) {
      console.log(chalk.greenBright('Current configuration:'));
      await displayCurrentConfig();
    }
    if (options.reset || options.overwrite) {
      await overwriteFile({ shouldConfirm: !options.overwrite });
    }
    if (options.update) {
      const [key, value] = options.update;
      await updateConfig(key, value);
    }
    if (options.description) {
      displayConfigDescription();
    }
  });
