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

const program = new Command();

program.version('0.0.1').description('An interface for creating git commits in the future.');

commands.forEach((command) => program.addCommand(command));

program.parse();
