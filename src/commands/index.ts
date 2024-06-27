import { add } from './add/add.js';
import { commit } from './commit/commit.js';
import { config } from './config/config.js';
import { push } from './push/push.js';
import { status } from './status/status.js';

export const commands = [status, add, commit, push, config];
