#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { commands } from './commands/index.js';
import { configFilePath, defaultConfig } from './configuration/index.js';

const configDir = path.dirname(configFilePath);

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig));
}

const programDescription = `This cli exists as an interface for altering git commit datetimes.
All functionality exists natively in Git but this cli greatly simplifies the process.`;

const program = new Command();

program.version('0.0.1').description(programDescription);

commands.forEach((command) => program.addCommand(command));

program.parse();
