import child_process from 'child_process';
import { exec } from '@';

test('execvpe should provide environment variables', async () => {
  const output = child_process.execFileSync('./tests/callExecvpe.ts');
  const jsonOut = JSON.parse(output.toString());
  expect(jsonOut).toMatchObject({
    test: 'asd',
    best: 'bsd',
  });
});
test('execvpe should throw when call fails', async () => {
  // Code 2 corresponds to `ENOENT`
  expect(() => exec.execvpe('invalidCommand', [], [])).toThrow('2');
});
