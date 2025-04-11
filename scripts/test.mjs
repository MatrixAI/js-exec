#!/usr/bin/env node

import os from 'node:os';
import url from 'node:url';
import process from 'node:process';
import childProcess from 'node:child_process';

const platform = os.platform();

/* eslint-disable no-console */
async function main(argv = process.argv) {
  argv = argv.slice(2);
  const npmArgs = [`run`, 'build'];
  console.error('Running build:');
  console.error(['npm', ...npmArgs].join(' '));
  childProcess.execFileSync('npm', npmArgs, {
    stdio: ['inherit', 'inherit', 'inherit'],
    windowsHide: true,
    encoding: 'utf-8',
    shell: platform === 'win32' ? true : false,
  });
  const jestArgs = [...argv];
  console.error('Running jest:');
  console.error(['jest', ...jestArgs].join(' '));
  childProcess.execFileSync('jest', jestArgs, {
    env: {
      ...process.env,
      NODE_OPTIONS: '--experimental-vm-modules',
    },
    stdio: ['inherit', 'inherit', 'inherit'],
    windowsHide: true,
    encoding: 'utf-8',
    shell: platform === 'win32' ? true : false,
  });
}
/* eslint-enable no-console */

if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    void main();
  }
}
