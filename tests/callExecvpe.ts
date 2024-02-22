#!/usr/bin/env ts-node

import { exec } from '@';
// This executes `printEnv.js` while setting environment variables
// eslint-disable-next-line no-console
console.log(
  exec.execvp('node', ['./tests/printEnv.js'], {
    TEST1: 'value1',
    TEST2: 'value2',
  }),
);
