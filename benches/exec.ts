import path from 'node:path';
import url from 'node:url';
import b from 'benny';
import { suiteCommon } from './utils/index.js';

const filePath = url.fileURLToPath(import.meta.url);

async function main() {
  const summary = await b.suite(
    path.basename(filePath, path.extname(filePath)),
    b.add('stub', () => {
      1 + 1;
    }),
    ...suiteCommon,
  );
  return summary;
}

if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    void main();
  }
}

export default main;
