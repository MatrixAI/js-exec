#!/usr/bin/env ts-node

import { exec } from '@';
// This executes `printEnv.js` while setting environment variables
// eslint-disable-next-line no-console
console.log(
  exec.execvpe('node', ['./tests/printEnv.js'], ['test=asd', 'best=bsd']),
);
