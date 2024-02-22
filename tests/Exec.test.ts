import child_process from 'child_process';
import { exec } from '@';

describe('execvp', () => {
  test('execvp should provide environment variables', async () => {
    // Setting envs to check
    const output = child_process.execFileSync('./tests/callExecvpe.ts');
    const jsonOut = JSON.parse(output.toString());
    expect(jsonOut['TEST1']).toBe('value1');
    expect(jsonOut['TEST2']).toBe('value2');
  });
  test('execvp should throw when call fails', async () => {
    // Code 2 corresponds to `ENOENT`
    expect(() => exec.execvp('invalidCommand', [], {})).toThrow('2');
  });
});
