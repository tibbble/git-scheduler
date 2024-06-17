import os from 'os';
import path from 'path';

export const configFilePath = path.join(os.homedir(), '.gsched', 'config.json');

export type Config = {
  workHourStart: string;
  workHourEnd: string;
};

export const defaultConfig: Config = {
  workHourStart: '9',
  workHourEnd: '17',
};

export const configDescription = {
  workHourStart: 'The hour at which the work day starts (0-23)',
  workHourEnd: 'The hour at which the work day ends (0-23)',
};

const hoursPattern = '^2[0-3]$|^[0-1]?[0-9]$';

export const configSchema = {
  type: 'object',
  properties: {
    workHourStart: {
      type: 'string',
      pattern: hoursPattern,
    },
    workHourEnd: {
      type: 'string',
      pattern: hoursPattern,
    },
  },
  required: ['workHourStart', 'workHourEnd'],
  additionalProperties: false,
};
